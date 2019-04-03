// To make images retina, add a "data-2x" attribute to the img element
document.addEventListener("DOMContentLoaded", function() {
	if (window.devicePixelRatio !== 2) {
		return;
	}

    var images = document.querySelectorAll("img[data-2x]");
    Array.prototype.forEach.call(images, function(el, i) {
        var src = el.getAttribute("data-2x");
        el.setAttribute("src", src);
    });
});
