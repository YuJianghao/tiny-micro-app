document.querySelector("#app").innerHTML = `
  <div>
    Hi from main.js
  </div>
`

function log(phase, ...args) {
  console.log(
    `%c[${phase}]`,
    `color: white;
    background: rgb(96 165 250);
    padding: 1px;
    border-radius: 3px;
    font-weight: bold`,
    ...args
  )
}

async function run() {
  // 取 html entry
  const res = await fetch("http://localhost:5174")
  const html = await res.text()
  log("html", html)

  // 处理 html 内容，挂载至 WebComponent
  const formattedHtml = html
    .replace(/<body>/g, "<tiny-micro-body>")
    .replace(/<\/body>/g, "</tiny-micro-body>")
    .replace(/<head/g, "<tiny-micro-head")
    .replace(/<\/head>/g, "</tiny-micro-head>")
  log("formattedHtml", formattedHtml)
  // DOMParser
  const wrapper = new DOMParser().parseFromString(formattedHtml, "text/html")
  log("wrapper", wrapper)
  const tinyMicro = document.createElement("tiny-micro")
  const tinyMicroHead = wrapper.querySelector("tiny-micro-head")
  const tinyMicroBody = wrapper.querySelector("tiny-micro-body")
  const script = tinyMicroBody.querySelector("script")
  script.remove()
  tinyMicro.appendChild(tinyMicroHead)
  tinyMicro.appendChild(tinyMicroBody)
  document.body.appendChild(tinyMicro)
  log("tinyMicroHead", tinyMicroHead)
  log("tinyMicroBody", tinyMicroBody)

  const app = {
    tinyMicro,
    tinyMicroHead,
    tinyMicroBody,
  }

  log("script", script)

  // 创建沙箱 & 运行 script
  const sandbox = await createSandbox(app)
  const scriptElement = sandbox.window.document.createElement("script")
  scriptElement.setAttribute("type", "module")
  scriptElement.src = "http://localhost:5174" + script.getAttribute("src")
  sandbox.microBody.appendChild(scriptElement)
}

async function createSandbox(app) {
  // 先创建一个看不见的 iframe
  const iframe = document.createElement("iframe")
  iframe.setAttribute("src", location.href)
  iframe.style.display = "none"
  document.body.appendChild(iframe)
  return new Promise((resolve) => {
    iframe.onload = () => {
      const sandbox = {
        microHead: iframe.contentWindow.document.head,
        microBody: iframe.contentWindow.document.body,
        window: iframe.contentWindow,
      }

      // 1. 重写 createElement，将 DOM 创建到主应用中
      iframe.contentWindow.Document.prototype.createElement =
        Document.prototype.createElement

        const rawAppendChild = sandbox.microBody.appendChild
        Object.defineProperty(sandbox.microBody, "appendChild", {
          get() {
            function appendChild(node) {
            // 2. script 仍需创建到 iframe 中
            // getHijackParent
            if (node.tagName === "SCRIPT") {
              return rawAppendChild.call(sandbox.microBody, node)
            }
            return rawAppendChild.call(app.tinyMicroBody, node)
          }
          return appendChild
        },
      })
      return resolve(sandbox)
    }
  })
}

// 无视掉一些非核心思路的 edge case
window.parent === window && run()
