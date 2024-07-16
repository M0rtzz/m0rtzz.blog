# 导出 CSDN 的收藏夹内容到本地

## 1

直接点击网站右上角的头像

![image-20240119225341349](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:38:22_3f12e2da88f762655d44dd780fb4749c.png)

之后点击`收藏`

![image-20240119225504799](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:38:58_5593f8a848c0ec4ac0d32ac91aa40e81.png)

展开你想保存的收藏夹，比如我选择`LaTeX`收藏夹

![image-20240119231450134](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:39:12_89c481662979af2992726547f2f15540.png)

## 2

按键盘 F12 或者右键网页空白处选择检查

在控制台（Console）中输入以下代码后回车会让你选择文件的保存位置

![image-20240119225855682](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:39:40_9098823064ffdd852dec7877bcbc174b.png)

![image-20240119230114625](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:39:46_c3b829920a04a5e2e14a9ae780a1e4c1.png)

```js
/**
 * @brief - 将文本内容保存到文件
 * @param {string} text - 要保存的文本内容
 * @param {string} file_name - 要保存的文件名
 */
function saveTextToFile(text, file_name) {
    var blob = new Blob([text], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file_name;
    a.click();
}

var output = ''; // 用于保存最终的输出文本内容

$('.collect-second-li a').each(function (index) {
    var href = $(this).attr('href'); // 获取链接地址
    var title = $(this).text(); // 获取链接标题
    output += (index + 1) + '. ' + title + '\n' + href + '\n\n';
});

saveTextToFile(output, 'output.txt');
```

## 3

查看保存的文件：

![image-20240119231531508](https://static.m0rtzz.com/images/Year:2024/Month:05/Day:26/16:40:11_bfad784f1a5a656d5c45522878e8b623.png)

大功告成~
