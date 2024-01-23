(function () {
  const closeBtnId = "changes-page-widget-close-btn";
  const widgetWrapperId = "changes-page__widget__container";

  const pageUrl = document.currentScript.src.split("/").slice(0, 3).join("/");

  function disableBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableBodyScroll() {
    document.body.style.overflow = "auto";
  }

  function openWidget() {
    const spinnerStyles = `
    .lds-ripple {
  display: inline-block;
  position: fixed;
  top: 30%;
  left: calc(100vw - 50% - 40px);
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #6366f1;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
`;
    // inject above styles to the page
    let style = document.createElement("style");
    style.id = "changes-page-widget-styles";
    style.innerHTML = spinnerStyles;
    document.head.appendChild(style);

    const spinner = `<div class="lds-ripple"><div></div><div></div></div>`;

    // create div element to hold the widget
    let modalDiv = document.createElement("div");
    modalDiv.id = widgetWrapperId;
    modalDiv.innerHTML = `<div id="${closeBtnId}" style="position: absolute; top: 8px; right: 8px; width: 29px; height: 29px; border-radius: 29px; display: flex; color: #738696; background: #f7f7f8; cursor: pointer;"><svg stroke="currentColor" stroke-width="2.2px" stroke-linecap="round" stroke-linejoin="round" fill="none" viewBox="0 0 24 24" class="PJLV PJLV-iPJLV-css" style="box-sizing: border-box; width: 19px; height: 19px; position: relative; flex: 0 0 auto; margin: auto;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>${spinner}</div>`;
    modalDiv.setAttribute(
      "style",
      "position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; overflow: hidden; z-index: 15; background-color: rgba(0, 0, 0, 0.2); padding-top: 48px; transition: opacity 150ms ease-out;"
    );
    modalDiv.style.display = "none";

    let widgetFrame = document.createElement("iframe");
    widgetFrame.src = pageUrl;
    widgetFrame.setAttribute(
      "style",
      "height: 100%; width: 100%; max-width: 670px; margin: 0 auto; box-shadow: 0px 6px 16px -2px rgba(0,0,0,0.08), 0px 16px 76px -7px rgba(0,0,0,0.1); border-top-left-radius: 8px; border-top-right-radius: 8px; transition: transform 150ms ease-out; transform: translateY(2000px);"
    );
    widgetFrame.onload = () => {
      widgetFrame.style.transform = "translateY(0)";
    };

    modalDiv.appendChild(widgetFrame);

    // append model div to body
    document.body.appendChild(modalDiv);

    modalDiv.style.display = "block";
    modalDiv.style.opacity = 1;
    disableBodyScroll();

    function closeWidget() {
      enableBodyScroll();

      // remove injected styles
      if (document.querySelector(`#${style.id}`))
        document.querySelector(`#${style.id}`).remove();

      widgetFrame.style.transform = "translateY(50px)";
      modalDiv.style.opacity = 0;

      setTimeout(() => {
        if (document.querySelector(`#${widgetWrapperId}`))
          document.querySelector(`#${widgetWrapperId}`).remove();
      }, 160);
    }

    // hide widget when clicking on close btn
    document
      .querySelector(`#${closeBtnId}`)
      .addEventListener("click", closeWidget);

    // hide widget when clicking on modal div
    modalDiv.addEventListener("click", closeWidget);
  }

  if (window) {
    window.ChangesPage = {};
    window.ChangesPage.openWidget = openWidget;
  }
})();
