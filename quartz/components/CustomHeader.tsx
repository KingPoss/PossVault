import { QuartzComponentConstructor} from "./types"
export default (() => {
  function CustomHeader() {
    return (
      <>
        <div className="headerflex">
          <pre className="rainbow" id="siteheader">
            {`88888888888 888    888 8888888888
    888     888    888 888       
    888     888    888 888       
    888     8888888888 8888888   
    888     888    888 888       
    888     888    888 888       
    888     888    888 888       
    888     888    888 8888888888`}
          </pre>
          <pre className="rainbow" id="siteheader">
            {`8888888b.   .d88888b.   .d8888b.   .d8888b.  888     888 888b     d888
888   Y88b d88P" "Y88b d88P  Y88b d88P  Y88b 888     888 8888b   d8888
888    888 888     888 Y88b.      Y88b.      888     888 88888b.d88888
888   d88P 888     888  "Y888b.    "Y888b.   888     888 888Y88888P888
8888888P"  888     888     "Y88b.     "Y88b. 888     888 888 Y888P 888
888        888     888       "888       "888 888     888 888  Y8P  888
888        Y88b. .d88P Y88b  d88P Y88b  d88P Y88b. .d88P 888   "   888
888         "Y88888P"   "Y8888P"   "Y8888P"   "Y88888P"  888       888`}
          </pre>
          <pre className="rainbow" id="siteheader">
            {`8888888b.  8888888888 888b    888
888  "Y88b 888        8888b   888
888    888 888        88888b  888
888    888 8888888    888Y88b 888
888    888 888        888 Y88b888
888    888 888        888  Y88888
888  .d88P 888        888   Y8888
8888888P"  8888888888 888    Y888`}
          </pre>
        </div>

        {/* Mobile navigation */}
        <div className="topnav" id="myTopnav">
          <a href="/index.html" className="active">
            <img src="/assets/mobileheader.gif" alt="" />
            <div className="rainbow">The Possum Den</div>
          </a>

          <div id="myLinks">
            <a href="kingposs.com/index">Home</a>
            <a href="kingposs.com/about">About Me</a>
            <a href="kingposs.com/art">Art/Media</a>
            <a href="kingposs.com/blog">Blog</a>
            <a href="kingposs.com/radio">Radio</a>
            <a href="kb.kingposs.com">Knowledge Base</a>
            <a href="kingposs.com/programs">Programs</a>
            <a href="#kingposs.com/sites">Cool Sites</a>
            <a href="kingposs.com/guestbook">Guestbook</a>
          </div>

          <a href="javascript:void(0);" className="icon" id="icon">
            <div className="mobilemenu"></div>
          </a>
        </div>

        {/* Desktop navigation */}
        <nav className="navbar">
            <a href="kingposs.com/index">Home</a>
            <a href="kingposs.com/about">About Me</a>
            <a href="kingposs.com/art">Art/Media</a>
            <a href="kingposs.com/blog">Blog</a>
            <a href="kingposs.com/radio">Radio</a>
            <a href="kb.kingposs.com">Knowledge Base</a>
            <a href="kingposs.com/programs">Programs</a>
            <a href="#kingposs.com/sites">Cool Sites</a>
            <a href="kingposs.com/guestbook">Guestbook</a>
        </nav>
      </>
    )
  }
CustomHeader.afterDOMLoaded = `
function myFunction() {
  var x = document.getElementById("myLinks");
  var y = document.getElementById("icon");

  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
  document.getElementById("myTopnav").classList.toggle("responsive");
}

document.getElementById("icon")?.addEventListener("click", myFunction)
window.addCleanup(() => {
  document.getElementById("icon")?.removeEventListener("click", myFunction)
})
`
  return CustomHeader
}) satisfies QuartzComponentConstructor
