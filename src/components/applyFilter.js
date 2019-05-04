const  applyFilter = (element, adjust,  data, texture, loopCanvasElement) => {
  //console.log(element, adjust,  data, texture, loopCanvasElement);
            // let adjust = adjust;
            let ajustObj = [];        
            if(element !== 'UndoRequired' || element !== 'UndoRequired'){
              let x = data.canvas.draw(texture);
              adjust.forEach(el => {
                let objAdj = {};
                if (el.name !== "triangleBlur" && el.name !== "sharpness") {
                  x[el.functionName](parseFloat(el.range) / 100, 0).update();
                  objAdj.name = el.name;
                  objAdj.range = el.range;
                  ajustObj.push(objAdj);
                } else {
                  if (el.name !== "triangleBlur") {
                    x[el.functionName](parseFloat(el.range), 0).update();
                    objAdj.name = el.name;
                    objAdj.range = el.range;
                    ajustObj.push(objAdj);
                  }
                  if (el.name !== "sharpness") {
                    if (el.range === 0) {
                      x[el.functionName](0, 0).update();
                    } else {
                      x[el.functionName](1, parseFloat(el.range) / 20).update();
                    }
                    objAdj.name = el.name;
                    objAdj.range = el.range;
                    ajustObj.push(objAdj);
                  }
                }
              });
            }
              else{
                let x = data.element.canvas.draw(texture);
                adjust.forEach(el => {
                  let objAdj = {};
                  if (el.name !== "triangleBlur" && el.name !== "sharpness" ) {
                    if(data.element.newAdjustName.name !==  el.name ){
                    x[el.functionName](parseFloat(el.range) / 100, 0).update();
                    objAdj.name = el.name;
                    objAdj.range = el.range;
                    ajustObj.push(objAdj);}
                    else{
                      x[el.functionName](parseFloat(data.element.oldAdjustName.range) / 100, 0).update();
                      objAdj.name = el.name;
                      objAdj.range = data.element.oldAdjustName.range;
                      ajustObj.push(objAdj);
                    }
                  } else {
                    if (el.name !== "triangleBlur" ) {
                      if(data.element.oldAdjustName.name !==  el.name ){
                      x[el.functionName](parseFloat(el.range), 0).update();
                      objAdj.name = el.name;
                      objAdj.range = el.range;
                      ajustObj.push(objAdj);}
                      else{
                        x[el.functionName](parseFloat(data.element.oldAdjustName.range), 0).update();
                        objAdj.name = el.name;
                        objAdj.range = data.element.oldAdjustName.range;
                      }
                    }
                    if (el.name !== "sharpness") {
                      if(data.element.oldAdjustName.name !==  el.name){
                        if (el.range === 0) {
                          x[el.functionName](0, 0).update();
                        } else {
                          x[el.functionName](1, parseFloat(el.range) / 20).update();
                        }
                      }else{
                        if (data.element.oldAdjustName.range === 0) {
                          x[el.functionName](0, 0).update();
                        } else {
                          x[el.functionName](1, parseFloat(data.element.oldAdjustName.range) / 20).update();
                        }
                      }
                      objAdj.name = el.name;
                      objAdj.range = data.element.oldAdjustName.range;
                      ajustObj.push(objAdj);
                    }
                  }
                })                      
              }
              let imgID, sendData = null;
          if(element !== 'UndoRequired' || element !== 'UndoRequired' ){
             imgID = data.id;
             sendData = data;
          }else{         
             imgID = data.element.adjustProps.id; 
             sendData = data.element.adjustProps           
          }
            if (
              document.getElementById(imgID) !== null &&
              document.getElementById(imgID).tagName === "IMG"
            ) {
              appendCanvas(data.selected.element[0], sendData).then(val => {
                if (val === "Appended") {
                  let currentItem = document.querySelector("#" + imgID);
                  currentItem.setAttribute(
                    "data-adjust",
                    JSON.stringify({ ...ajustObj })
                  );
                }
              });
            }
            if ( document.getElementById(imgID) && document.getElementById(imgID).tagName === "CANVAS") {
              let currentItem = document.querySelector("#" + imgID);
              currentItem.setAttribute("data-adjust", JSON.stringify({ ...ajustObj }));
            }
            if (loopCanvasElement) {
              appendCanvas(loopCanvasElement, sendData).then(val => {
                if (val === "Appended") {
                  let currentItem = document.querySelector("#" + imgID);                  
                  currentItem.setAttribute(
                    "data-adjust",
                    JSON.stringify({ ...ajustObj })
                  );
                }
              });
            }
            //this.test(imgID);
            //this.init(this.props.data.element[0].getAttribute('id'))
          };
          
     const  appendCanvas = (element, data) => {
            return new Promise((resolve, reject) => {
              let getClass = element.getAttribute("class");
              let getId = element.getAttribute("id");
              document
                .getElementById(getId)
                .parentElement.appendChild(data.canvas);
              data.canvas.classList.add(getClass);
              data.canvas.setAttribute("id", getId);
              element.remove();
              resolve("Appended");
            });
          };
 
export default applyFilter;
