import React, { Component } from "react";
import "./Adjust.css";
import Slider from "../slider/slider";
import Hue from "react-color/lib/Hue";
import Dropdown from "../Dropdown/dropdown";
import applyFilter  from "../applyFilter";
import { timingSafeEqual } from "crypto";
//import applyFilter from "../applyFilter" 
/*import Jimp from 'jimp';
import $ from "jquery";
  import $ from "jquery";
import F from '../../plugins/filtrr2';
import '../../plugins/events'
import '../../plugins/effects'
import '../../plugins/util'
import '../../plugins/layers' 
import Filtrr2 from '../../plugins/filtrr2' */

class Adjust extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.apf = applyFilter
    this.imageElement = document.getElementById(this.props.id);
    // this.applyFilter = this.applyFilter.bind(window)
    this.state = {
      adjust: [
        {
          name: "brightness",
          range: 0,
          functionName: "brightnessContrast"
        },
        {
          name: "contrast",
          range: 0,
          functionName: "brightnessContrast"
        },
        {
          name: "hue",
          range: 0,
          functionName: "hueSaturation"
        },
        {
          name: "saturation",
          range: 0,
          functionName: "hueSaturation"
        },
        {
          name: "vibrance",
          range: 0,
          functionName: "vibrance"
        },
        {
          name: "noise",
          range: 0,
          functionName: "noise"
        },
        {
          name: "sepia",
          range: 0,
          functionName: "sepia"
        },
        {
          name: "triangleBlur",
          range: 0,
          functionName: "triangleBlur"
        },
        {
          name: "ink",
          range: 0,
          functionName: "ink"
        },
        {
          name: "sharpness",
          range: 0,
          functionName: "unsharpMask"
        }
      ],
      filter: {
        showFilterBtn: false,
        filters: [
          { value: "Filters", id: "" },
          { value: "Epic", id: "epic" },
          { value: "Festive", id: "festive" },
          { value: "AfterGlow", id: "afterGlow" },
          { value: "Solar", id: "solar" },
          { value: "Cali", id: "cali" },
          { value: "Nordic", id: "nordic" },
          { value: "GreyScale", id: "greyScale" },
          { value: "Street", id: "street" }
        ]
      },
      key: null,
      // ,
      // {
      //   name: "tint",
      //   range: 0,
      //   functionName: "tint"
      // }

      changedElement: null
    };
    /* Filters with there values */
    this.filtersDefination = {
      Epic: [
        {
          name: "brightness",
          range: 6
        },
        {
          name: "contrast",
          range: -20
        },
        {
          name: "saturation",
          range: -14
        },
        {
          name: "sepia",
          range: 50
        }
      ],
      Festive: [
        {
          name: "brightness",
          range: 10
        },
        {
          name: "contrast",
          range: 21
        },
        {
          name: "saturation",
          range: 24
        },
        {
          name: "sepia",
          range: 40
        },
        {
          name: "sharpness",
          range: 7
        }
      ],
      AfterGlow: [
        {
          name: "brightness",
          range: 15
        },
        {
          name: "contrast",
          range: -19
        },
        {
          name: "saturation",
          range: -12
        },
        {
          name: "sepia",
          range: 50
        },
        {
          name: "sharpness",
          range: 23
        }
      ],
      Solar: [
        {
          name: "brightness",
          range: 18
        },
        {
          name: "contrast",
          range: 45
        },
        {
          name: "saturation",
          range: 42
        },
        {
          name: "sepia",
          range: 0
        }
      ],
      Cali: [
        {
          name: "brightness",
          range: 22
        },
        {
          name: "contrast",
          range: -46
        },
        {
          name: "saturation",
          range: 38
        },
        {
          name: "sepia",
          range: 27
        }
      ],
      Nordic: [
        {
          name: "brightness",
          range: 15
        },
        {
          name: "contrast",
          range: -16
        },
        {
          name: "saturation",
          range: -50
        }
      ],
      GreyScale: [
        {
          name: "brightness",
          range: 15
        },
        {
          name: "contrast",
          range: 20
        },
        {
          name: "saturation",
          range: -100
        },
        {
          name: "sepia",
          range: 50
        },
        {
          name: "sharpness",
          range: 23
        }
      ],
      Street: [
        {
          name: "brightness",
          range: -7
        },
        {
          name: "contrast",
          range: -19
        },
        {
          name: "saturation",
          range: -12
        },
        {
          name: "sepia",
          range: 50
        },
        {
          name: "sharpness",
          range: 23
        }
      ]
    };

    this.loopCanvasElement = null;
    this.currentId = this.props.selected.element[0].id;

    
    if (this.props.selected.element[0].tagName === "IMG") {
      this.texture = this.props.canvas.texture(this.props.selected.element[0]);
    }
    if (this.props.selected.element[0].tagName === "CANVAS") {
      console.log(this.props.selected.element[0].toDataURL());
      this.props.selected.allImageElement.forEach(el => {
        // console.log(el.getAttribute('id') , this.props.selected.allImageElement,el.getAttribute('id'), this.props.selected.element[0].getAttribute('id'), this.props.selected.element[0].getAttribute('id').indexOf(el.getAttribute('id')));
        if (
          el.getAttribute("id") ===
          this.props.selected.element[0].getAttribute("id")
        ) {
          this.loopCanvasElement = el;
          this.texture = this.props.canvas.texture(el);
        }
      });
    }
  }

  componentDidMount() {
    let filter = { ...this.state.filter };
    filter.showFilterBtn = true;
    this.setState({ filter: filter }, async () => {
      this.historyObj = {
        type: "ImageFilter",
        elementType: this.imageElement.nodeName,
        element: {
          ele: this.imageElement,
          parentEle: this.imageElement.parentNode,
          canvas: this.props.canvas,
          imageAdjustedState: this.state.adjust,
          loopCanvasElement: this.loopCanvasElement,
          texture: this.texture,
          adjustProps: this.props
        },
        action: "adjust",
        undoaction: "reset"
      };
      await this.props.clearRedo().then(val => {
        if (val === "redo cleared" || val === "Nothing inside redo") {
          this.props.history.undo.push(this.historyObj);
          console.log(this.props.history);
        }
      });
    });
    if (this.props.selected.element[0].getAttribute("data-adjust")) {
      console.log(
        this.props.selected.element[0].toDataURL(),
        "lalallalalallal"
      );
      let data_adjust = JSON.parse(
        this.props.selected.element[0].getAttribute("data-adjust")
      );
      let adjust = [...this.state.adjust];
      let newArray = [];
      adjust.map(el => {
        for (let i in data_adjust) {
          if (data_adjust[i].name === el.name) {
            data_adjust[i].functionName = el.functionName;
            newArray.push(data_adjust[i]);
          }
        }
      });
      this.setState(
        {
          adjust: newArray
        },
        () => {
          // console.log(this.loopCanvasElement);
          this.props.selected.element[0].parentElement.appendChild(
            this.loopCanvasElement
          );
          this.props.selected.element[0].remove();
          // this.applyFilter();
          this.apf(null,this.state.adjust, this.props, this.texture, this.loopCanvasElement)
        }
      );
    }
  }
 
  slidderChangeHandler = (event, element) => {
    event.persist();
    let temp = element;
    let adjust = [...this.state.adjust];
    adjust.map(el => {
      // if (el.name === element.name && element.name !== 'tint') {
      if (el.name === element.name) {
        el.range = event.target.value;
      }
    });
    adjust = [...this.state.adjust];
    this.setState({ adjust: adjust, changedElement: element }, async () => {
       //this.applyFilter(temp);
       this.apf(temp, this.state.adjust, this.props, this.texture, this.loopCanvasElement)
      if (event.type === "mousedown") {
        this.imageElement = document.getElementById(this.props.id);
       // console.log(element, "mousedown");
        this.historyObj = {
          type: "ImageFilter",
          elementType: this.imageElement.nodeName,
          element: {
            ele: this.imageElement,
            parentEle: this.imageElement.parentNode,
            canvas: this.props.canvas,
            newAdjustName: JSON.parse(JSON.stringify(element)),
            loopCanvasElement: this.loopCanvasElement,
            texture: this.texture,
            adjustProps: this.props
          },
          action: "adjust",
          undoaction: "adjust"
        };
      }
      if (event.type === "mouseup") {
        //console.log(element,this, "mouseup");
        this.imageElement = document.getElementById(this.props.id);
        this.historyObj.element.ele = this.imageElement;
        this.historyObj.elementType = this.imageElement.nodeName;
        let swap = this.historyObj.element.newAdjustName;
        this.historyObj.element.newAdjustName = JSON.parse(JSON.stringify(element));
        this.historyObj.element.oldAdjustName = swap;
        this.historyObj.element.adjustProps = this.props;
        this.historyObj.element.texture = this.texture;
        this.historyObj.element.imageAdjustedState = JSON.parse(JSON.stringify(this.state.adjust));
        await this.props.clearRedo().then(val => {
          if (val === "redo cleared" || val === "Nothing inside redo") {
            this.props.history.undo.push(this.historyObj);
            console.log(this.props.history);
          }
        });
      }
    });
  };

  /* Applying filter on image */
  
  // applyFilter = element => {
  //   let adjust = [...this.state.adjust];
  //   let x = this.props.canvas.draw(this.texture);
  //   let ajustObj = [];

  //   adjust.forEach(el => {
  //     let objAdj = {};
  //     if (el.name !== "triangleBlur" && el.name !== "sharpness") {
  //       x[el.functionName](parseFloat(el.range) / 100, 0).update();
  //       objAdj.name = el.name;
  //       objAdj.range = el.range;
  //       ajustObj.push(objAdj);
  //     } else {
  //       if (el.name !== "triangleBlur") {
  //         x[el.functionName](parseFloat(el.range), 0).update();
  //         objAdj.name = el.name;
  //         objAdj.range = el.range;
  //         ajustObj.push(objAdj);
  //       }
  //       if (el.name !== "sharpness") {
  //         if (el.range === 0) {
  //           x[el.functionName](0, 0).update();
  //         } else {
  //           x[el.functionName](1, parseFloat(el.range) / 20).update();
  //         }
  //         objAdj.name = el.name;
  //         objAdj.range = el.range;
  //         ajustObj.push(objAdj);
  //       }
  //     }
  //   });
  //   let imgID = this.props.selected.element[0].getAttribute("id");
  //   // console.log("Imhhhhhjhhhh", imgID, document.getElementById(imgID), this.loopCanvasElement);

  //   if (
  //     document.getElementById(imgID) !== null &&
  //     document.getElementById(imgID).tagName === "IMG"
  //   ) {
  //     this.appendCanvas(this.props.selected.element[0]).then(val => {
  //       if (val === "Appended") {
  //         let currentItem = document.querySelector("#" + this.currentId);
  //         currentItem.setAttribute(
  //           "data-adjust",
  //           JSON.stringify({ ...ajustObj })
  //         );
  //       }
  //     });
  //   }
  //   if (
  //     document.getElementById(imgID) &&
  //     document.getElementById(imgID).tagName === "CANVAS"
  //   ) {
  //     let currentItem = document.querySelector("#" + this.currentId);
  //     currentItem.setAttribute("data-adjust", JSON.stringify({ ...ajustObj }));
  //   }
  //   if (this.loopCanvasElement) {
  //     //console.log("looping element", this.loopCanvasElement);
  //     this.appendCanvas(this.loopCanvasElement).then(val => {
  //       if (val === "Appended") {
  //         let currentItem = document.querySelector("#" + this.currentId);
  //         currentItem.setAttribute(
  //           "data-adjust",
  //           JSON.stringify({ ...ajustObj })
  //         );
  //       }
  //     });
  //   }
  //   //this.test(imgID);
  //   //this.init(this.props.selected.element[0].getAttribute('id'))
  // };



  test = (imgID, rgb) => {
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    let pro = null;
    Array.prototype.map.call(this.props.selected.allImageElement, el => {
      if (el.getAttribute("id") === imgID) {
        pro = el;
      }
    });
    const image = new Image();
    image.src = pro.currentSrc;
    image.onload = function() {
      const canvas = document.getElementById(imgID);
      /*  canvas.width = image.naturalWidth;
       canvas.height = image.naturalHeight;
    */
      const gl = canvas.getContext("webgl");
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(1.0, 0.8, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const vertShaderSource = `
       attribute vec2 position;
   
       varying vec2 texCoords;
   
       void main() {
         texCoords = (position + 1.0) / 2.0;
         texCoords.y = 1.0 - texCoords.y;
         gl_Position = vec4(position, 0, 1.0);
       }
     `;

      const fragShaderSource = `
       precision highp float;
   
       varying vec2 texCoords;
   
       uniform sampler2D textureSampler;
   
       void main() {
        
   
         vec4 color = texture2D(textureSampler, texCoords);
        
       
        vec3 tint = vec3(${r}, ${g}, ${b});  // reddish

        color.rgb *= tint;
         gl_FragColor = color;
       }
     `;

      const vertShader = gl.createShader(gl.VERTEX_SHADER);
      const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

      gl.shaderSource(vertShader, vertShaderSource);
      gl.shaderSource(fragShader, fragShaderSource);

      gl.compileShader(vertShader);
      gl.compileShader(fragShader);

      const program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);

      gl.linkProgram(program);

      gl.useProgram(program);

      const vertices = new Float32Array([
        -1,
        -1,
        -1,
        1,
        1,
        1,

        -1,
        -1,
        1,
        1,
        1,
        -1
      ]);

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(program, "position");

      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLocation);

      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
  };
  resetHandler = () => {
    let adjust = [...this.state.adjust];
    const shouldResetWork = adjust.every(el => el.range === 0);
    adjust = [...this.state.adjust];
    adjust.forEach(el => {
      if (el.range !== 0) {
        el.range = 0;
      }
    });
    if (this.props.selected.element[0].tagName === "CANVAS") {
      this.setState({ adjust: adjust }, () => {
        // this.applyFilter();
        this.apf(null, this.state.adjust, this.props, this.texture, this.loopCanvasElement)
      });
    } else {
      if (!shouldResetWork) {
        this.texture = this.props.canvas.texture(
          this.props.selected.element[0]
        );
        //let x = this.props.canvas.draw(this.texture);
        this.setState({ adjust: adjust }, () => {
          // this.applyFilter();
          this.apf(null, this.state.adjust, this.props, this.texture, this.loopCanvasElement)
        });
      } else {
        alert("There is nothing to reset");
      }
    }
  };
  init = id => {
    let canvas = document.getElementById(id);
    let gl = canvas.getContext("experimental-webgl");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 0.0, 0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var v = document.getElementById("vertex").firstChild.nodeValue;
    var f = document.getElementById("fragment").firstChild.nodeValue;

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, v);
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, f);
    gl.compileShader(fs);

    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
      console.log(gl.getShaderInfoLog(vs));

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
      console.log(gl.getShaderInfoLog(fs));

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.log(gl.getProgramInfoLog(program));

    var aspect = canvas.width / canvas.height;

    var vertices = new Float32Array([
      -0.5,
      0.5 * aspect,
      0.5,
      0.5 * aspect,
      0.5,
      -0.5 * aspect,
      -0.5,
      0.5 * aspect,
      0.5,
      -0.5 * aspect,
      -0.5,
      -0.5 * aspect
    ]);

    let vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let itemSize = 2;
    let numItems = vertices.length / itemSize;

    gl.useProgram(program);

    program.uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform4fv(program.uColor, [0.0, 0.0, 0.0, 0.5]);

    program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(
      program.aVertexPosition,
      itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.drawArrays(gl.TRIANGLES, 0, numItems);
  };
  tintHandler = e => {
    if (this.props.selected.element[0].tagName === "CANVAS") {
      let imgID = this.props.selected.element[0].getAttribute("id");
      this.test(imgID, e.rgb);
    } else {
      console.log("Image element");
    }
  };
  dropdownClickHandler = event => {
    let adjust = [...this.state.adjust];
    if (event.target.value !== "Filters") {
      if (this.props.selected.element[0].tagName !== "IMG") {
        this.resetHandler();
        this.props.selected.allImageElement.forEach(el => {
          if (
            el.getAttribute("id") ===
            this.props.selected.element[0].getAttribute("id")
          ) {
            this.loopCanvasElement = el;
            this.texture = this.props.canvas.texture(el);
          }
        });
        adjust.forEach(el => {
          this.filtersDefination[event.target.value].forEach(element => {
            if (el.name === element.name) {
              el.range = element.range;
            }
          });
        });
      } else {
        adjust.forEach(el => {
          this.filtersDefination[event.target.value].forEach(element => {
            if (el.name === element.name) {
              el.range = element.range;
            }
          });
        });
        this.texture = this.props.canvas.texture(
          this.props.selected.element[0]
        );
      }
      // this.applyFilter();
      this.apf(null, this.state.adjust, this.props, this.texture, this.loopCanvasElement)
      this.setState({ key: Math.random() * 6 });
    }
  };
  render() {
    let slider = this.state.adjust.map((element, i) => {
      // if(element.name !== 'tint'){
      if (
        element.name === "brightness" ||
        element.name === "contrast" ||
        element.name === "saturation" ||
        element.name === "hue" ||
        element.name === "vibrance" ||
        element.name === "exposure"
      ) {
        return (
          <Slider
            SliderRange={element}
            draggged={(event, element) =>
              this.slidderChangeHandler(event, element)
            }
            min="-100"
            max="100"
            step="1"
            slidertype={element.name}
            key={element.name + i}
          />
        );
      } else {
        return (
          <Slider
            SliderRange={element}
            draggged={(event, element) =>
              this.slidderChangeHandler(event, element)
            }
            min="0"
            max="100"
            step="1"
            slidertype={element.name}
            key={element.name + i}
          />
        );
      }
      // }
      // else{
      //   return (
      //     <div className="slidecontainer" key={element.name + i}>
      //        <span className="trans">Tint</span>
      //        <Hue width={60 + '%'} onChange={(event) => this.slidderChangeHandler(event,element) } />
      //        <span>0</span>
      //     </div>

      //   )
      // }
    });
    return (
      <React.Fragment>
        {this.state.filter.showFilterBtn ? (
          <Dropdown
            dropdown={this.state.filter.filters}
            dropdownClick={this.dropdownClickHandler}
          />
        ) : null}
        <div className="adjust-main-container">{slider}</div>
        <button onClick={this.resetHandler}>Reset</button>
        <div className="adjust-main-container">
          <div className="slidecontainer">
            <span className="trans">Tint</span>
            <Hue width={60 + "%"} onChange={this.tintHandler} />
            <span>0</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Adjust;

/*
Unsharp Mask [demo]
canvas.unsharpMask(radius, strength);

Vignette [demo]
canvas.vignette(size, amount);

Lens Blur [demo]
canvas.lensBlur(radius, brightness, angle);

Zoom Blur [demo]
canvas.zoomBlur(centerX, centerY, strength);

Hexagonal Pixelate [demo]
canvas.hexagonalPixelate(centerX, centerY, scale);

Ink [demo]
canvas.ink(strength); */
