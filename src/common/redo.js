import $ from "jquery";
const performRedo = data => {
        let redoData = data;
        switch (redoData.type) {
          case "text":
            {
              this[redoData.action]("RedoRequired", data);
            }
            break;
          case "move":
            {
              let position = redoData.undoaction.position;
              //console.log(redoData.undoaction.helper[0].id);
              if (redoData.undoaction.helper[0].id) {
                document.querySelector(
                  "#" + redoData.undoaction.helper[0].id
                ).style.left = position.left + "px";
                document.querySelector(
                  "#" + redoData.undoaction.helper[0].id
                ).style.top = position.top + "px";
              }
            }
            break;
          case "permanent-grouped":
            {
              this.check(
                redoData.element.childrenEle,
                "RedoRequired",
                redoData.element
              );
              this.check("permGroup", "RedoRequired", redoData.element);
            }
            break;
          case "flip":
            {
              this[redoData.undoaction](
                redoData.transformMatrixArr,
                redoData.actionType,
                "RedoRequired",
                redoData.element.ele
              );
            }
            break;
          case "position":
            {
              if (data.action === "Backwards") {
                $(data.element.ele).insertBefore($(data.element.ele).prev());
              } else if (data.action === "Forwards") {
                $(data.element.ele).insertAfter($(data.element.ele).next());
              } else if (data.action === "To Back") {
                if (
                  $(redoData.element.ele)
                    .parent()
                    .attr("class")
                    .indexOf("wrapped") <= -1 &&
                  $(redoData.element.ele)
                    .parent()
                    .attr("class")
                    .indexOf("perm") <= -1
                ) {
                  $(redoData.element.ele).insertBefore(
                    $(redoData.element.ele).parent()[0].firstChild
                  );
                }
              } else if (data.action === "To Front") {
                if (
                  $(redoData.element.ele)
                    .parent()
                    .attr("class")
                    .indexOf("wrapped") <= -1 &&
                  $(redoData.element.ele)
                    .parent()
                    .attr("class")
                    .indexOf("perm") <= -1
                ) {
                  $(redoData.element.ele).insertAfter(
                    $(redoData.element.ele).parent()[0].lastChild
                  );
                }
              } else if (data.action === "Top") {
                console.log(redoData);
                let wrappedPostion = redoData.element.newWrappedPostion;
                let postionArray = redoData.element.newPostionArray;
                console.log(wrappedPostion, postionArray);
    
                $(".wrapped").css({
                  top: wrappedPostion.wrappedTop.top,
                  left: wrappedPostion.wrappedLeft.left,
                  width:
                    wrappedPostion.wrappedRight.right -
                    wrappedPostion.wrappedLeft.left,
                  height:
                    wrappedPostion.wrappedBottom.bottom -
                    wrappedPostion.wrappedTop.top
                });
                postionArray.map(async (el, i) => {
                  await this.setElemPosition(el, i, wrappedPostion).then(val => {
                    postionArray[i].diffTop = val.diffTop;
                    postionArray[i].diffLeft = val.diffLeft;
                    if (wrappedPostion.totalDiffLeft < val.diffLeft) {
                      wrappedPostion.totalDiffLeft = val.diffLeft;
                    }
                  });
                });
              }
            }
            break;
          case "Tranparency":
            {
              if (redoData.element.ele[0].id) {
                this[redoData.undoaction](null, redoData.element, "RedoRequired");
              } else {
                this.history.undo.pop();
              }
            }
            break;
          default:
            console.log("This is default");
            break;
        }
      };
 
export default performRedo;