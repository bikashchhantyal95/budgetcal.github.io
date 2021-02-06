//Budget Controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //   var allEcpenses = [];
  //   var allIncomes = [];
  //   var totalEcpenses = 0;
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Create new item either inc or exp
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem); //push it into our data structure
      //return new element
      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;
      //data.allItems[type][id];
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {
      //calculate total income income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      //calculate percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      //Expenses = 5000 income = 10000 spent = (5000/10000)*100% = 50%
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage();
      });
    },
    getPercentages: function () {
      var allPercentages = data.allItems.exp.map(function () {});
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})(); //IIFE(Immidiately invoked function expression) USed

// var Expense = function (id, description, value) {
//   this.id = id;
//   this.description = description;
//   this.value = value;
// };

//-------------------------------------------------------------
//UI Controller
var UIControlller = (function () {
  var DOMStrings = {
    inpuType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomesContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inpuType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //create HTML string with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomesContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function (selectedID) {
      var element = document.getElementById(selectedID);
      element.parentNode.removeChild(element);
    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, arrray) {
        current.value = "";
      });
    },
    displayBudget: function (obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },
    getDOMSStrings: function () {
      return DOMStrings;
    },
  };
})();

//---------------------------------------------------------------
//Global App Controller
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListners = function () {
    var DOM = UICtrl.getDOMSStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      //console.log(event.keyCode);
      if (event.keyCode === 13 || event.which === 13) {
        //console.log("Enter key was pressed.");
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteBtn);
  };

  var updateBudget = function () {
    //1. calulate the budget
    budgetCtrl.calculateBudget();

    //2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3.Display the budget in the UI
    UICtrl.displayBudget(budget);
    //console.log(budget);
  };

  var upadtePercentages = function () {
    //1. calculate percentages
    //2. Read percentages freom budget controller
    //3. update the ui with new percentages
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1. Get the value from input
    input = UICtrl.getInput();
    //console.log(input);
    if (input.description != "" && input.value > 0 && !isNaN(input.value)) {
      //2. Add the item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item to UI
      UICtrl.addListItem(newItem, input.type);

      //4. clear input fields
      UICtrl.clearFields();

      //5. update the budeget
      updateBudget();

      //6. calculate and update percentages
      upadtePercentages();
    }

    //console.log("Working");
  };

  var ctrlDeleteBtn = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      //console.log(splitID[0]);

      type = splitID[0];
      ID = parseInt(splitID[1]);
      //1. delete the item from data structure
      budgetCtrl.deleteItem(type, ID);

      //2. Delete the item from UI
      UICtrl.deleteListItem(itemID);

      //3. Update and show new budget
      updateBudget();
    }
    //console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
  };

  return {
    init: function () {
      console.log("Application Started");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListners();
    },
  };
})(budgetController, UIControlller);

controller.init();
