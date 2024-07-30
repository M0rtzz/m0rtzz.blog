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

---

***以下为测试内容：***

## MDX components

### Code Group

<CodeGroup >

```ts blog-config.ts
export const repoName = 'm0rtzz.blog'
export const repoOwner = 'M0rtzz'
export const site = 'https://m0rtzz.com'
```

```yml graphql.config.yml
schema:
  - https://api.github.com/graphql:
      headers:
        Authorization: Bearer ${GITHUB_TOKEN}
documents: '**/*.ts'
```

</CodeGroup>

### Details

<Details summary="Details">

Details Block

```yml graphql.config.yml
schema:
  - https://api.github.com/graphql:
      headers:
        Authorization: Bearer ${GITHUB_TOKEN}
documents: '**/*.ts'
```

Details block is a collapsible component.

</Details>

### Github Alerts

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Shiki

### Twoslash

```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users'.toUpperCase(),
  //  ^?
}

todo.title = 'Hello'

Number.parseInt('123', 10)
//      ^|




```

```ts twoslash
// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

---

### Shiki Transformers

#### transformerNotationDiff

```ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.log('goodbye')
```

---

#### transformerNotationHighlight

```ts
console.log('Not highlighted')
console.log('Highlighted') // [!code highlight]
console.log('Not highlighted')
```

```ts
// [!code highlight:3]
console.log('Highlighted')
console.log('Highlighted')
console.log('Not highlighted')
```

---

#### transformerNotationWordHighlight

```ts
// [!code word:Hello]
const message = 'Hello World'
console.log(message) // prints Hello World
```

```ts
// [!code word:Hello:1]
const message = 'Hello World'
console.log(message) // prints Hello World
```

---

#### transformerNotationFocus

```ts
console.log('Not focused')
console.log('Focused') // [!code focus]
console.log('Not focused')
```

```ts
// [!code focus:3]
console.log('Focused')
console.log('Focused')
console.log('Not focused')
```

---

#### transformerNotationErrorLevel

```ts
console.log('No errors or warnings')
console.error('Error') // [!code error]
console.warn('Warning') // [!code warning]
```

---

#### transformerMetaHighlight

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

#### transformerMetaWordHighlight

```js /Hello/
const msg = 'Hello World'
console.log(msg) // prints Hello World
```
