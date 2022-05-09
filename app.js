let answer = 0;
let realValue = 0;
let currentValue;

document.querySelector("#buttons").addEventListener("click", (e) => {
  reset();

  if (e.target.tagName == "BUTTON" && availableSpace() == true) {
    switch (e.target.textContent) {
      case "x²":
        document.querySelector("#display input").value += "²";
        break;

      case "√x":
        document.querySelector("#display input").value += "√";
        break;
      case "del":
      case "C":
      case "=":
        break;

      default:
        document.querySelector("#display input").value += e.target.textContent;
        break;
    }
  }

  switch (e.target.textContent) {
    case "del":
    case "C":
    case "=":
      break;
  }
  result(e.target.textContent);
});

window.addEventListener("keydown", (e) => {
  reset();

  if (availableSpace() == true) {
    if (!isNaN(parseInt(e.key))) {
      str(e.key);
    }
    switch (e.key) {
      case "+":
      case "-":
      case ".":
        str(e.key);
        break;
      case "/":
        str("÷");
        break;
      case "*":
        str("×");
        break;
      case "a":
        str("Ans");
        break;
      case "c":
        str("cos");
        break;
      case "s":
        str("sin");
        break;
      case "t":
        str("tan");
        break;
      case "e":
        str("E");
        break;
      case "^":
        str("²", "x²", "²");
        break;
    }
  }

  switch (e.key) {
    case "Delete":
      str("nil", "C");
      break;
    case "Backspace":
      str("nil", "del");
      break;
    case "=":
      str("nil", "=");
      break;
  }

  function str(output, findbtn, res) {
    if (findbtn == undefined && res == undefined) {
      document.querySelector("#display input").value += output;
      findButton(output);
      result(output);
      return;
    }
    if (output == "nil") {
      findButton(findbtn);
      result(findbtn);
      return;
    }
    document.querySelector("#display input").value += output;
    findButton(findbtn);
    result(res);
  }

  function findButton(button) {
    let buttons = document.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent == button) {
        buttons[i].classList.add("active");
        setTimeout(() => {
          buttons[i].classList.remove("active");
        }, 300);

        break;
      }
    }
  }
});

function reset() {
  if (document.querySelector("#display input").classList.contains("active")) {
    document.querySelector("#display input").classList.remove("active");
    document.querySelector("#display b").classList.remove("active");
    document.querySelector("#display input").value = "";
    document.querySelector("#display b").textContent = "";
  }
}

function availableSpace(active) {
  if (document.querySelector("#display input").value.length > 9) {
    return false;
  }
  return true;
}

function result(button) {
  if (button === "C") {
    document.querySelector("#display input").value = "";
    document.querySelector("#display b").textContent = "";
    return;
  }

  if (button === "=" && document.querySelector("#display input").value != "") {
    if (document.querySelector("#display b").textContent == "") {
      document.querySelector("#display b").textContent = "Syntax error";
      return;
    }
    document.querySelector("#display input").classList.add("active");
    document.querySelector("#display b").classList.add("active");
    answer = parseFloat(realValue);

    addAnswer();
    return;
  }

  if (button === "del") {
    let inputValue = document.querySelector("#display input").value;
    inputValue = inputValue.slice(0, inputValue.length - 1);

    if (
      inputValue.slice(-2) == "An" ||
      inputValue.slice(-2) == "co" ||
      inputValue.slice(-2) == "ta" ||
      inputValue.slice(-2) == "si"
    ) {
      inputValue = inputValue.slice(0, inputValue.length - 2);
    }
    document.querySelector("#display input").value = inputValue;
  }

  displayResult(calCulate());
}

function calCulate() {
  let inputValue = document.querySelector("#display input").value;
  let e = 0;
  let hold = false;
  let position = [];
  let sign = [];
  let calcValue = "";

  for (let i = 0; i < inputValue.length; i++) {
    switch (inputValue[i]) {
      case "A":
        if (hold == false) calcValue += answer.toString();
        else hold = true;

        e = 2;
        break;

      case "t":
      case "c":
        if (inputValue.slice(i + 3, inputValue.length) !== "") {
          let num = parseFloat(inputValue.slice(i + 3, inputValue.length));
          let numCount = num.toString().length;

          if (isNaN(num)) {
            num = answer;
            numCount = 3;
          }
          switch (inputValue[i]) {
            case "t":
              num = Math.tan((Math.PI * num) / 180);
              break;
            case "c":
              if (num == 90) {
                num = 0;
                break;
              }
              num = Math.cos((Math.PI * num) / 180);
              break;
          }

          if (isNaN(parseFloat(calcValue[calcValue.length - 1])))
            calcValue += num;
          else calcValue += "×" + num;

          hold = true;
          e = 3 + numCount;
        }
        break;

      case "s":
        if (inputValue[i - 1] != "n" && inputValue[i - 1] != "o") {
          if (inputValue.slice(i + 3, inputValue.length) !== "") {
            let num = parseFloat(inputValue.slice(i + 3, inputValue.length));
            let numCount = num.toString().length;

            if (isNaN(num)) {
              num = answer;
              numCount = 3;
            }

            num = Math.sin((Math.PI * num) / 180);
            if (isNaN(parseFloat(calcValue[calcValue.length - 1])))
              calcValue += num;
            else calcValue += "×" + num;

            hold = true;
            e = 3 + numCount;
          }
        }
        break;

      case "√":
        if (inputValue.slice(i + 1, inputValue.length) !== "") {
          let num = parseFloat(inputValue.slice(i + 1, inputValue.length));
          let numCount = num.toString().length;

          if (isNaN(num)) {
            num = answer;
            numCount = 3;
          }
          num = Math.sqrt(num);

          if (isNaN(parseFloat(calcValue[calcValue.length - 1])))
            calcValue += num;
          else calcValue += "×" + num;

          if (inputValue.slice(i + 1, i + 2) == "A") hold = true;
          e = numCount + 1;
        }
        break;

      case "²":
        if (
          calcValue.includes("+") ||
          calcValue.includes("-") ||
          calcValue.includes("÷") ||
          calcValue.includes("×")
        ) {
          for (let p = calcValue.length - 1; p >= 0; p--) {
            if (isNaN(parseFloat(calcValue[p]))) {
              let num = Math.abs(calcValue.slice(p + 1, calcValue.length));
              num = parseFloat(num) * parseFloat(num);

              if (calcValue[p] == "-")
                calcValue = calcValue.slice(0, p) + num.toString();
              else calcValue = calcValue.slice(0, p + 1) + num.toString();
              break;
            }
          }
        } else calcValue = parseFloat(calcValue) * parseFloat(calcValue);
        break;

      case "E":
        if (inputValue.slice(i + 1, inputValue.length) !== "") {
          let num = parseFloat(inputValue.slice(i + 1, inputValue.length));
          let str = num.toString();
          let l = calcValue;
          let r = -1;
          num = Math.pow(10, num);

          for (let index = calcValue.length - 1; index >= 0; index--) {
            if (
              calcValue[index] == "+" ||
              calcValue[index] == "-" ||
              calcValue[index] == "÷" ||
              calcValue[index] == "×"
            ) {
              l = parseFloat(calcValue.slice(index + 1));
              r = index;
              break;
            }
          }

          num = num * l;
          calcValue = calcValue.slice(0, r + 1) + num.toString();

          e = str.length + 1;
        }
        break;

      case ".":
      default:
        if (e == 0) {
          calcValue += inputValue[i];
        }
        break;
    }
    e--;
    if (e == -1) {
      e = 0;
    }
  }

  for (let u = 1; u < calcValue.length; u++) {
    if (isNaN(parseInt(calcValue[u]))) {
      if (calcValue[u] != ".") {
        position.push(u);
        sign.push(calcValue[u]);
      }
    }
  }

  let total = parseFloat(calcValue);
  if (sign[0] !== undefined) {
    r = 0;
    while (r < sign.length) {
      if (r == 0) {
        let lNum = position[1];
        if (lNum == undefined) lNum = calcValue.length;

        let number1 = parseFloat(calcValue.slice(0, position[0]));
        let number2 = parseFloat(calcValue.slice(position[0] + 1, lNum));
        total = mathFunc(number1, number2, sign[0]);

        currentValue = total;
      } else {
        let lNum = position[r + 1];
        if (lNum == undefined) lNum = calcValue.length;

        let number1 = currentValue;
        let number2 = parseFloat(calcValue.slice(position[r] + 1, lNum));

        total = mathFunc(number1, number2, sign[r]);

        currentValue = total;
      }
      r++;
    }
  }

  if (isNaN(total)) {
    return "";
  }
  return total;
}

function mathFunc(no1, no2, sign) {
  switch (sign) {
    case "+":
      return no1 + no2;

    case "-":
      return no1 - no2;

    case "÷":
      return no1 / no2;

    case "×":
      return no1 * no2;
  }
}

function displayResult(result) {
  realValue = result;

  if (
    result !== "" &&
    result.toString().length > 8 &&
    result.toString().indexOf(".") == -1
  ) {
    let d = result.toString().length;
    result = result.toString().slice(0, 7) + `<sup>e${d - 7}</sup>`;
  }

  if (result !== "" && result.toString().indexOf(".") !== -1) {
    let d = result.toString().split(".");

    if (d[1].length > 4) {
      for (let i = 4; i >= 0; i--) {
        if (d[1][i] != "9") {
          result = result.toFixed(i + 1);
          break;
        }
        if (i == 0 && d[1][i] == "9") {
          result = Math.round(result);
          break;
        }
      }
    }
  }

  document.querySelector("#display b").innerHTML = result;
}

function addAnswer() {
  let equation = document.querySelector("#display input").value;
  let solution = document.querySelector("#display b").textContent;

  let li = document.createElement("li");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");
  let hr = document.createElement("hr");

  li.classList.add("center", "col", "active");
  span1.classList.add("center");
  span1.textContent = equation;
  span2.textContent = solution;

  li.append(span1, span2, hr);

  if (document.querySelector("#display ul").childElementCount > 1) {
    setTimeout(() => {
      document
        .querySelector("#display ul")
        .removeChild(document.querySelector("#display ul").children[2]);
    }, 500);
  }

  
  document.querySelector("#display ul").prepend(li);
  setTimeout(() => {
    li.classList.remove("active");
  }, 400);

  li.addEventListener("mousemove", (e) => {
    let box = li.getBoundingClientRect();
    let x = Math.abs(Math.round(((e.x - box.x) / box.width) * 100));
    let y = Math.abs(Math.round(((e.y - box.y) / box.height) * 100));

    hr.style.left = x + "%";
    hr.style.top = y + "%";

    setTimeout(() => hr.classList.add("active"), 10);
  });
  li.addEventListener("mouseout", () => hr.classList.remove("active"));
}

document.querySelector("#display ul").addEventListener("click", (e) => {
  if (e.target.tagName == "LI") acquire(e.target);
  else acquire(e.target.parentElement);

  function acquire(tagName) {
    let equation = tagName.children[0].textContent;
    let solution = tagName.children[1].textContent;

    document.querySelector("#display input").value = equation;
    document.querySelector("#display b").textContent = solution;

    if (document.querySelector("#display input").classList.contains("active")) {
      document.querySelector("#display input").classList.remove("active");
      document.querySelector("#display b").classList.remove("active");
    }
  }
});
