

/*
    引入
       import {compressImg,readImg} from '../../assets/js/imageUtil'

    const img = await readImg(file)
    const blob = await compressImg(img, file.type, 1000, 1000)
    //构造表单文件，
    const formData = new FormData()
    //设置文件名和后缀
    formData.append('file', blob, 'xxx.png')
  //  上传文件
    axios.post('http://xxx.com/api',formData)

 */


// 压缩前将file转换成img对象
export function readImg(file) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()
        reader.onload = function(e) {
            img.src = e.target.result
        }
        reader.onerror = function(e) {
            reject(e)
        }
        reader.readAsDataURL(file)
        img.onload = function() {
            resolve(img)
        }
        img.onerror = function(e) {
            reject(e)
        }
    })
}

/**
 * 压缩图片
 *@param img 被压缩的img对象
 * @param type 压缩后转换的文件类型
 * @param maxWidth 触发压缩的图片最大宽度限制
 * @param maxHeight 触发压缩的图片最大高度限制
 */
export function compressImg(img, type='image/png', maxWidth=1000, maxHeight=1000) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const { width: originWidth, height: originHeight } = img

        console.log("原始宽度")
        console.log(originWidth)

        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > 1) {
                // 宽图片
                targetWidth = maxWidth
                targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
                // 高图片
                targetHeight = maxHeight
                targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
        }
        console.log("目标宽度")
        console.log(targetWidth)
        console.log("目标高度")
        console.log(targetHeight)

        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        canvas.toBlob(function(blob) {
            //blob转file
            resolve(blob)
        }, type || 'image/png') })
}

/*
Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。
File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
 */
