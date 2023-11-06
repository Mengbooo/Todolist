// ***************************************************************************************************************************
// 搜索框输入内容转化为item，nums items left的计数
var input = document.getElementById("search");
var bodyPage = document.getElementById("bodypage");
var footer = document.getElementById("footer");
var num = 0;
footer.style.display = "none";

// 监听搜索栏按键事件
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13 && input.value.trim() !== "") {
    var inputValue = input.value;
    localStorage.setItem("todo_" + num, inputValue);
    var newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.innerHTML =
      '<input type="checkbox" class="checkbox"><p class="p">' +
      inputValue +
      '</p><i class="deletebtn"><ion-icon name="close-circle-outline"></ion-icon></i>';

    bodyPage.appendChild(newPage);
    

    input.value = "";

    // 更新计数器
    num++;
    updateNumCounter();

    // 取消footer部分的隐藏
    if (num != 0) {
      footer.style.display = "flex";
    }

    // 监听checkbox状态变化
    var checkbox = newPage.querySelector(".checkbox");
    checkbox.addEventListener("change", function (event) {
      var page = event.target.parentNode;
      if (checkbox.checked) {
        page.classList.add("changed");
        num--;
      } else {
        page.classList.remove("changed");
        num++;
      }
      updateNumCounter();
    });

    // 监听删除按钮点击事件
    var deletebtn = newPage.querySelector(".deletebtn");
    deletebtn.addEventListener("click", function (event) {
      var page = event.target.parentNode.parentNode;
      page.remove();
      var index = Array.prototype.indexOf.call(bodyPage.children, page);
      localStorage.removeItem("todo_" + index);

      if (!checkbox.checked) {
        num--;
      }
      updateNumCounter();
    });
  }
});

// 更新计数器显示
function updateNumCounter() {
  var numCounter = document.getElementById("numCounter");
  numCounter.innerHTML = "<p>" + num + " items left</p>";
}

// ***************************************************************************************************************************
//双击改变item的内容
//思路：双击，删除<p></p>里的内容，把p标签的原来位置改为input标签，再套用一下搜索框那里的代码，
// 但是把input标签转变为p标签，再插入内容（能这样搞吗）
// 获取用户双击的目标元素的最近祖先元素中第一个具有 page 类的元素
// CSDN:    closest 方法是从当前元素自身开始向上查找，可以直接找到最近的祖先元素
//祖先元素：直接或间接包含后代元素的元素，父元素也是祖先元素
document.querySelector("body").addEventListener("dblclick", function (event) {
  // 获取用户双击的目标元素
  var target = event.target;
  var page = target.closest(".page");
  if (page && target.tagName === "P") {
    // 获取该元素下第一个具有 p 类的子元素，保存为 textElement
    var textElement = target;
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = textElement.innerText;
    inputElement.classList.add("inputElement");
    page.replaceChild(inputElement, textElement);
    inputElement.focus();
    // 给 inputElement 添加键盘按下事件监听器
    inputElement.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        var newValue = inputElement.value;
        // 更新待办事项信息
        textElement.innerText = newValue;
        // bodyPage.children不是真正的数组，是nodelist，无法直接使用indexOf()方法来查找指定元素
        // 要获取page在bodyPage.children中的索引
        var index = Array.prototype.indexOf.call(bodyPage.children, page);
        localStorage.setItem("todo_" + index, newValue);


        // 将 inputElement 替换为 textElement，可以继续双击编辑该元素
        page.replaceChild(textElement, inputElement);
        // 更新localStorage中的数据
        // var index = Array.prototype.indexOf.call(bodyPage.children, page);
        // localStorage.setItem('todo_' + index, newValue);
      }
    });
  }
});

// ***************************************************************************************************************************

// ***************************************************************************************************************************
//下面四个键的功能
//点击active时，页面只显示未被checked的待办事项；点击completed时，页面只显示被checked的待办事项；点击all时，显示所有待办事项，不分checked或者未checked
//点击all completed时，删去所有checked的事项，并将它们从localstorage中删除

//写的最整齐的一集

// ***************************************************************************************************************************
// 获取筛选按钮的引用
var allButton = document.querySelector(".b1");
var completedButton = document.querySelector(".b2");
var activeButton = document.querySelector(".b3");
var allCompletedButton = document.querySelector(".b4");

// 为筛选按钮添加点击事件监听器
allButton.addEventListener("click", function () {
  // 显示所有待办事项
  showAllItems();
});

completedButton.addEventListener("click", function () {
  // 仅显示已完成的待办事项
  showCompletedItems();
});

activeButton.addEventListener("click", function () {
  // 仅显示未完成的待办事项
  showActiveItems();
});

allCompletedButton.addEventListener("click", function () {
  // 删除所有已完成的待办事项
  removeAllCompletedItems();
  localStorage.clear();
});

// 显示所有待办事项的函数
function showAllItems() {
  var pages = document.querySelectorAll(".page");
  pages.forEach(function (page) {
    page.style.display = "flex";
  });
}

// 仅显示已完成的待办事项的函数
function showCompletedItems() {
  var pages = document.querySelectorAll(".page");
  pages.forEach(function (page) {
    var checkbox = page.querySelector(".checkbox");
    if (checkbox.checked) {
      page.style.display = "flex";
    } else {
      page.style.display = "none";
    }
  });
}

// 仅显示未完成的待办事项的函数
function showActiveItems() {
  var pages = document.querySelectorAll(".page");
  pages.forEach(function (page) {
    var checkbox = page.querySelector(".checkbox");
    if (!checkbox.checked) {
      page.style.display = "flex";
    } else {
      page.style.display = "none";
    }
  });
}

// 删除所有已完成的待办事项的函数
function removeAllCompletedItems() {
  var pages = document.querySelectorAll(".page");
  pages.forEach(function (page) {
    var checkbox = page.querySelector(".checkbox");
    if (checkbox.checked) {
      page.remove();

      // 从localStorage中删除相应的项目
      // var index = Array.prototype.indexOf.call(bodyPage.children, page);
      // localStorage.removeItem('todo_' + index);
    }
  });

  // 更新项目计数
  num = document.querySelectorAll(".page").length;
  var numCounter = document.getElementById("numCounter");
  numCounter.innerHTML = "<p>" + num + " items left</p>";
}

// ***************************************************************************************************************************

// ***************************************************************************************************************************
//搜索栏处按钮（若存在未checked，点击后全部checked，再次点击后，全部取消checked）
var checkbutton = document.getElementById("checkbutton");
checkbutton.addEventListener("click", function () {
  var checkboxes = document.querySelectorAll(".checkbox");
  var bodyPage = document.getElementById("bodypage");
  var isAllChecked = true; // 是否所有checkbox都被选中，初始化为true

  checkboxes.forEach(function (checkbox) {
    if (!checkbox.checked) {
      checkbox.checked = true;
      // bodyPage.classList.add('changed');
      //这个地方导致已经被check的待办事项又套了一层change属性，导致remove时只能消除一个
      if (!checkbox.classList.contains("changed")) {
        checkbox.parentElement.classList.add("changed");
      }
      //checkbox.parentElement实际上对应的就是每个checkbox的page
      num = 0;
      numCounter.innerHTML = "<p>" + num + " items left</p>";
      isAllChecked = false; // 只要有一个checkbox未被选中，则isAllChecked变为false
    } else {
      isAllChecked = isAllChecked && true;
      // 只有所有的checkbox都被选中，isAllChecked才变为true
      // 在forEach循环中，需要将isAllChecked变量名作为&&运算符的右侧逻辑表达式的一部分，保证该逻辑表达式得到计算，
      // 避免当isAllChecked=false时，isAllChecked = isAllChecked && true这一行代码不执行
    }
  });

  if (isAllChecked) {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
      if (checkbox.parentElement.classList.contains("changed")) {
        checkbox.parentElement.classList.remove("changed");
      }
    });
    // bodyPage.classList.remove('changed');这个似乎不能乱用，它选中的是所有对象
    num = checkboxes.length;
    numCounter.innerHTML = "<p>" + num + " items left</p>";
  } else {
    checkboxes.forEach(function (checkbox) {
      if (!checkbox.checked) {
        checkbox.checked = true;
        bodyPage.classList.add("changed");
      }
    });
  }
});
// ***************************************************************************************************************************

// ***************************************************************************************************************************

//使用localstorage渲染页面

// 渲染页面中的待办事项
function renderTodoItems() {
  var bodyPage = document.getElementById("bodypage");
  var numCounter = document.getElementById("numCounter");
  var footer = document.getElementById("footer");

  // 获取所有的待办事项
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.indexOf("todo_") === 0) {
      // key.indexOf('todo_') === 0 是用来判断键名是否以 "todo_" 开头。如果是以 "todo_" 开头的键名，表示它是一个待办事项的键名。/
      var value = localStorage.getItem(key);
      var index = parseInt(key.substring(5));
      // 从字符串key的第5个字符开始截取到末尾，并将截取的部分转换为整数
      // parseInt(key.substring(5)) 将键名中的数字部分提取出来，并转换为整数类型，赋值给 index 变量。这个数字部分代表了待办事项的索引
      var checked = localStorage.getItem("checked_" + index); // 获取待办事项的状态

      addTodoItem(value, index, checked); // 将状态传递给 addTodoItem 函数

      // 根据状态计数器增加或减少
      if (checked === "true") {
        numCounter.innerHTML = "<p>" + num + " items left</p>";
      } else {
        num++;
      }
    }
  }

  // 显示计数器和底部栏
  numCounter.innerHTML = "<p>" + num + " items left</p>";
  if (num !== 0) {
    footer.style.display = "flex";
  }
}

// 添加待办事项元素到页面
function addTodoItem(value, index, checked) {
  // 修改 checked 参数为从 localStorage 中获取
  var bodyPage = document.getElementById("bodypage");
  var numCounter = document.getElementById("numCounter");
  var footer = document.getElementById("footer");

  var newPage = document.createElement("div");
  newPage.classList.add("page");

  // 根据状态设置样式
  if (checked === "true") {
    newPage.classList.add("changed");
  }

  newPage.innerHTML =
    '<input type="checkbox" class="checkbox"><p class="p">' +
    value +
    '</p><i class="deletebtn"><ion-icon name="close-circle-outline"></ion-icon></i>';

  bodyPage.appendChild(newPage);

  // 监听checkbox状态变化
  var checkbox = newPage.querySelector(".checkbox");
  checkbox.checked = checked === "true"; // 设置checkbox的状态值
  checkbox.addEventListener("change", function (event) {
    var page = event.target.parentNode;
    if (checkbox.checked) {
      page.classList.add("changed");
      num--;
    } else {
      page.classList.remove("changed");
      num++;
    }
    updateCounter();

    // 更新待办事项的状态到 localStorage
    localStorage.setItem("checked_" + index, checkbox.checked);
  });

  // 监听删除按钮点击事件
  var deletebtn = newPage.querySelector(".deletebtn");
  deletebtn.addEventListener("click", function (event) {
    var page = event.target.parentNode.parentNode;
    page.remove();
    var index = Array.prototype.indexOf.call(bodyPage.children, page);
    localStorage.removeItem("todo_" + index);
    localStorage.removeItem("checked_" + index);

    if (!checkbox.checked) {
      num--;
    }
    updateCounter();

    // 更新num的值
    num = localStorage.length;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderTodoItems();
});

var input = document.getElementById("search");
var bodyPage = document.getElementById("bodypage");
var footer = document.getElementById("footer");

footer.style.display = "none";

input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13 && input.value.trim() !== "") {
    var inputValue = input.value;
    localStorage.setItem("todo_" + num, inputValue);
    localStorage.setItem("checked_" + num, false); // 设置待办事项的默认状态为未checked
    addTodoItem(inputValue, num, false); // 将状态传递给 addTodoItem 函数
    input.value = "";
    num++;
    var numCounter = document.getElementById("numCounter");
    numCounter.innerHTML = "<p>" + num + " items left</p>";
    if (num !== 0) {
      footer.style.display = "flex";
    }
  }
});

function updateCounter() {
  var numCounter = document.getElementById("numCounter");
  numCounter.innerHTML = "<p>" + num + " items left</p>";
}
