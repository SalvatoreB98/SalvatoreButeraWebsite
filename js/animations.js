export function animation1(doc,classNameAnimation){
    doc.style.transition = "all 1s";
    if (doc.classList.value.includes("animation-1")){
        doc.classList.remove("animation-1")
        doc.style.transition = "none";
        setTimeout(()=>{
            doc.style.transition = "all 1s";
            doc.classList.add("animation-1")
        },50)
    } else {
        doc.style.transition = "all 1s";
        doc.classList.add("animation-1")
    }
}