export const gfmTaskListItemHtml = {
  enter: {
    taskListCheck() {
      this.tag('<input ')
    }
  },
  exit: {
    taskListCheck() {
      this.tag('disabled="" type="checkbox">')
    },
    taskListCheckValueChecked() {
      this.tag('checked="" ')
    }
  }
}
