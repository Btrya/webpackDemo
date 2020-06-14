import css from './css/style.css';
import less from './css/black.less';
import sass from './css/nav.scss';
import bilibili from './caibin.js'

{
  const caibinString = 'Hello World!!!'
  document.getElementById('title').innerHTML = caibinString
}
// bilibili()
$('#title').html('Goodbye Vtech')

var json = require("../config.json")
document.getElementById("json").innerHTML = "name：" + json.name