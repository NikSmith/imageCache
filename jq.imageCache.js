(function(){
    $.fn.imageCache = function(){
        var isCanvasSupported = function (){
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        };

        var isLocalStorageSupported = function (){
            return !!(window.localStorage)
        };

        function ImgToBase64(url, callback, outputFormat){
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                // Clean up
                canvas = null;
            };
            img.src = url;
        }

        function init(){
            var self = this;
            var error = false;
            if (!isCanvasSupported() || !isLocalStorageSupported()){
                console.log("Вы используете устаревший браузер. Canvas или LocalStorage не поддерживается");
                return;
            }
            $(self).on("load",function(){
                if (error){
                    //Отменяем повторное сохранениеэ
                    return;
                }
                ImgToBase64(self.src, function(base64Img){
                    var canSet = $(self).hasClass("imageCache");
                    if (canSet){
                        localStorage.setItem(self.src,base64Img);
                    }
                });
            });
            $(self).on("error",function(){
                error = true;
                var image = localStorage.getItem(self.src);
                if (image){
                    $(self).attr("src",image);
                }
            });
        }
        return this.each(init);
    };
})();







