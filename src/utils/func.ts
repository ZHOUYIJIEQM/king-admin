/**
 * 深拷贝
 */
function deepClone(obj: any) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

// 格式化时间
function formatDate (time: number) {
  const d = new Date(time)
  const f = (num: number) => {
    return num < 10 ? `0${num}` : num;
  }
  return `${d.getFullYear()}-${f(d.getMonth()+1)}-${f(d.getDate())} ${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`
}
export {
  deepClone,
  formatDate
}