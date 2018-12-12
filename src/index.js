// VSC version 2.6.2

const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const hexToRgba = require('hex-and-rgba').hexToRgba
const mustache = require('mustache')
const f = require('float')

const files = [
  {
    src: 'default.json',
    des: 'Material Default.xccolortheme'
  },
  {
    src: 'lighter.json',
    des: 'Material Lighter.xccolortheme'
  },
  {
    src: 'darker.json',
    des: 'Material Darker.xccolortheme'
  },
  {
    src: 'ocean.json',
    des: 'Material Ocean.xccolortheme'
  },
  {
    src: 'palenight.json',
    des: 'Material Palenight.xccolortheme'
  }
]
const templete = fs.readFileSync('src/Templete.xccolortheme', 'utf-8')

for (file of files) {
  let srcp = path.join('src/vsc', file.src)
  let dest = path.join('xcode-themes', file.des)

  if (!fs.existsSync(srcp)) {
    console.log('☠️ - File "%s" not exist!', srcp)
    continue
  }

  let variant = jsonfile.readFileSync(srcp)
  for (key in variant.scheme) {
    if (key != 'base') {
      variant.scheme[key] = hex2Rgba(variant.scheme, key)
    }
  }
  for (key in variant.scheme.base) {
    variant.scheme.base[key] = hex2Rgba(variant.scheme.base, key)
  }

  let theme = mustache.render(templete, variant)
  fs.writeFileSync(dest, theme)
  console.log('😁 - "%s" succeed!', dest)
}

function hex2Rgba(object, key) {
  let rgba = []
  if (key == 'lineHighlight') {
    rgba = hexToRgba(object[key] + '50')
  } else {
    rgba = hexToRgba(object[key])
  }

  let arr = []
  arr[0] = f.round(rgba[0] / 255, 6)
  arr[1] = f.round(rgba[1] / 255, 6)
  arr[2] = f.round(rgba[2] / 255, 6)
  arr[3] = f.round(rgba[3], 6)
  return arr.join(' ')
}
