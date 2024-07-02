document.querySelector("#app").innerHTML = `
  <div>
    Hi from main.js
  </div>
`

function log(phase, ...args) {
  console.log(`[${phase}]`, ...args)
}

async function run() {
  if (/** vite 开发环境的问题，和微前端没关系 */ window.parent !== window)
    return
  const res = await fetch("http://localhost:5174")
  const html = await res.text()
  log("html", html)
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
  const script = tinyMicroBody.querySelector("script")
  log("script", script)
  const scriptContent = await fetch(
    "http://localhost:5174" + script.getAttribute("src")
  ).then((res) => res.text())
  log("scriptContent", scriptContent)
  const sandbox = await createSandbox(app)
  const scriptElement = sandbox.window.document.createElement("script")
  scriptElement.setAttribute("type", "module")
  scriptElement.src = "http://localhost:5174" + script.getAttribute("src")
  sandbox.microBody.appendChild(scriptElement)
}

async function createSandbox(app) {
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
      iframe.contentWindow.Document.prototype.createElement =
        Document.prototype.createElement

      Object.defineProperty(sandbox.microBody, "appendChild", {
        get() {
          return app.tinyMicroBody.appendChild
        },
      })
      return resolve(sandbox)
    }
  })
}

run()
