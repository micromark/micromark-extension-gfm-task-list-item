export const gfmTaskListItemHtml = {
  enter: {taskListCheck: enterCheck},
  exit: {taskListCheck: exitCheck, taskListCheckValueChecked: checked}
}

function enterCheck() {
  this.tag('<input ')
}

function checked() {
  this.tag('checked="" ')
}

function exitCheck() {
  this.tag('disabled="" type="checkbox">')
}
