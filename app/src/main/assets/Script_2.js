var scene = document.getSceneById('scene3');



var blank = scene.getSceneObjectById('blank');
var copyImg = scene.getSceneObjectById('copyImg');



var moveLastPos = null;

var canvasX = 0;
var canvasY = 0;
var brushRad = 60;
var prePos = null;

scene.addEventListener("Scene Start", function(evt){
    blank.setVisible(true);
    blank.tempBuffer2 = copyImg.createPixelBufferFromImage();
    blank.pixelBuffer = new PixelBuffer(blank.getWidth(), blank.getHeight());
    blank.tempBuffer1 = new PixelBuffer(blank.getWidth(), blank.getHeight());
    blank.dotGrp = scene.getSceneObjectById('dotGrp');

    for(var i = 0; i < blank.dotGrp.getChildren().length; i++){
        blank.dotGrp.getChildren()[i].passed = false;
    }
    blank.addEventListener('Press', function (evt) {
        prePos = new Vector2([evt.clientX - evt.target.getTransform().translation.x, evt.clientY - evt.target.getTransform().translation.y]);
    })

    blank.addEventListener('Move', function (evt) {

        var mouseInImgPosX = evt.clientX - evt.target.getTransform().translation.x;
        var mouseInImgPosY = evt.clientY - evt.target.getTransform().translation.y;

        var curPos = new Vector2([evt.clientX - evt.target.getTransform().translation.x, evt.clientY - evt.target.getTransform().translation.y]);

        //check dots is passed
        for(var i = 0; i < blank.dotGrp.getChildren().length;i++){
            var obj = blank.dotGrp.getChildren()[i];
            if(obj.passed == true){
                continue;
            }

            if(obj.getTransform().translation.subtract(curPos).magnitude() <= 120){
                obj.passed = true;
            }
        }


        var x = Math.min(prePos.x, mouseInImgPosX);
        var y = Math.min(prePos.y, mouseInImgPosY);
        var w = Math.abs(mouseInImgPosX - prePos.x);
        var h = Math.abs(mouseInImgPosY - prePos.y);

        var r = brushRad + 2;

        x -= r;
        y -= r;
        w += 2 * r;
        h += 2 * r;

        evt.target.tempBuffer1.setFillColor([0, 0, 0, 0]);
        drawLine(evt.target.tempBuffer1, [0, 0, 0, 1], prePos, curPos);
        evt.target.tempBuffer2.copyFromRegion(x, y, evt.target.tempBuffer1, x, y, w, h, 4);
        //
        drawLine(evt.target.pixelBuffer, [1, 1, 1, 1], prePos, curPos);
        evt.target.pixelBuffer.copyFromRegion(x, y, evt.target.tempBuffer2, x, y, w, h, 2);

        evt.target.getBitsFromPixelBuffer(evt.target.pixelBuffer);

        function drawLine(pixelBuffer, color, pprevPos, ppos) {
            var prevPos = new Vector2(pprevPos);
            var pos = new Vector2(ppos);
            var dir = pos.subtract(prevPos);
            var len = dir.magnitude();
            dir = dir.normalize();

            var step = Math.floor(brushRad / 2 - 1);
            if (step <= 0) step = 1;
            pixelBuffer.setFillColor(color);

            for (var i = 0; i < len;) {

                var curPos = prevPos.add(dir.multiply(i));
                pixelBuffer.fillCircle(curPos.x, curPos.y, brushRad);
                i += step;
                if (i > len) i = len;
            }
        }


        prePos = curPos;
    })


    blank.addEventListener('Release', function (evt) {
        prePos = null;
        var flag = true;
        for(var i = 0; i < blank.dotGrp.getChildren().length;i++){
            var obj = blank.dotGrp.getChildren()[i];
            if(obj.passed == false){
                flag = false;
            }
        }
        if(flag == true){
            evt.target.pixelBuffer.setFillColor([0, 0, 0, 0]);
            evt.target.pixelBuffer.fill();
            evt.target.getBitsFromPixelBuffer(evt.target.pixelBuffer);

            for(var i = 0; i < blank.dotGrp.getChildren().length; i++){
                blank.dotGrp.getChildren()[i].passed = false;
            }
            blank.setVisible(false);
            sendMessage(scene,'right')
        }

    })
});

scene.addEventListener("Scene Stop", function(){

});


function sendMessage(scene, msg){
    var evt = scene.createEvent("Receive Message");
    evt.message = msg;
    scene.dispatchEvent(evt);
}


