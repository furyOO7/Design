import $ from "jquery";
import applyFilter  from "./components/applyFilter";
const performUndo = async (data, sendTransSlidderStateUndo) => {
    let undoData = data;
    switch (undoData.type) {
      case "text":
        {
          let elementId = undoData.element.ele.id;
          this[undoData.undoaction]("UndoRequired", elementId);
        }
        break;
      case "move":
        {
          let originalPosition = undoData.undoaction.originalPosition;
          // console.log(undoData);
          undoData.undoaction.helper[0].style.left =
            originalPosition.left + "px";
          undoData.undoaction.helper[0].style.top = originalPosition.top + "px";
          // if (undoData.elementType === 'Wrapped') {
          //   this.unwrapAll();
          // }
        }
        break;
      /* Do not remove below commented code */
      /*  case 'removeElement': {
         this[undoData.undoaction]("UndoRequired", data);
       }
         break; */
      /*  case 'permanent-grouped': {
        let element = undoData.element.ele;
        this[undoData.undoaction](element);
        this.check(undoData.element.childrenEle, "UndoRequired", undoData.element);
      }
        break; */
      case "wrapped":
        {
          this[undoData.undoaction]();
        }
        break;
      case "permanent-grouped":
        {
          let element = undoData.element.ele;
          this[undoData.undoaction](element, "UndoRequired", undoData);
        }
        break;

      case "flip":
        {
          this[undoData.undoaction](
            undoData.newtransformMatrixArr,
            undoData.actionType,
            "UndoRequired",
            undoData.element.ele
          );
        }
        break;
      case "position":
        {
          if (data.action === "Backwards") {
            $(this.positionElement).insertAfter($(this.positionElement).next());
          } else if (data.action === "Forwards") {
            $(this.positionElement).insertBefore(
              $(this.positionElement).prev()
            );
          } else if (data.action === "To Back") {
            if (
              $(undoData.element.ele)
                .parent()
                .attr("class")
                .indexOf("wrapped") <= -1 &&
              $(undoData.element.ele)
                .parent()
                .attr("class")
                .indexOf("perm") <= -1
            ) {
              $(undoData.element.ele).insertAfter(
                $(undoData.element.ele).parent()[0].lastChild
              );
            }
          } else if (data.action === "To Front") {
            if (
              $(undoData.element.ele)
                .parent()
                .attr("class")
                .indexOf("wrapped") <= -1 &&
              $(undoData.element.ele)
                .parent()
                .attr("class")
                .indexOf("perm") <= -1
            ) {
              $(undoData.element.ele).insertBefore(
                $(undoData.element.ele).parent()[0].firstChild
              );
            }
          } else if (data.action === "Top") {
            let wrappedPostion = undoData.element.wrappedOriginal;
            let postionArray = undoData.element.positionArrayOriginal;
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
           await sendTransSlidderStateUndo(undoData).then((val) => {
               console.log(val);
               
               if(val === 'StateUpdated'){
            this[undoData.undoaction](null, undoData.element, "UndoRequired");}

           })
        }
        break;
        case "ImageFilter":
        {
          let adjust = this.state.adjust
          adjust = "UndoRequired"
         this.setState({ adjust: adjust });
          
        }
        break;
      default:
        console.log("This is default");
        break;
    }
  };
 
export default performUndo;