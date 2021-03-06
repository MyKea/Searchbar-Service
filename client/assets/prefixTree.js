/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */

//  === AUTHOR: Gabe Anderson (FEC Teammate) ===  //

export default class PrefixTree {
  constructor(...args) {
    this.complete = false;
    this.children = {};
    for (const string of args) {
      this.add(string);
    }
  }

  find(string, allowPartial = false, returnTree = false) {
    const char = string.charAt(0);
    const rest = string.slice(1);
    if (char === '' && (allowPartial || this.complete)) {
      return returnTree ? this : true;
    }
    if (!this.children.hasOwnProperty(char)) {
      return returnTree ? null : false;
    }
    return this.children[char].find(rest, allowPartial, returnTree);
  }

  contains(string = '', allowPartial = false) {
    return this.find(string, allowPartial, false);
  }

  get(string = '', allowPartial = false) {
    return this.find(string, allowPartial, true);
  }

  add(string) {
    const char = string.charAt(0);
    const rest = string.slice(1);
    if (!this.children.hasOwnProperty(char)) {
      this.children[char] = new PrefixTree();
    }
    if (rest !== '') {
      this.children[char].add(rest);
    } else {
      this.children[char].complete = true;
    }
  }

  remove(string) {
    const char = string.charAt(0);
    const rest = string.slice(1);
    if (char === '') {
      if (Object.keys(this.children).length === 0) {
        return true;
      } else {
        this.complete = false;
        return false;
      }
    } else if (!this.children.hasOwnProperty(char)) {
      return false;
    } else if (this.children[char].remove(rest)) {
      delete this.children[char];
      if (Object.keys(this.children).length === 0 && this.complete === false) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  getCompleteChildren(progress = '', limit = 5, currentCount = 0) {
    let completeChildren = [];
    if (this.complete) {
      completeChildren.push(progress);
      currentCount += 1;
    }
    for (const key of Object.keys(this.children)) {
      if (currentCount > limit) {
        break;
      }

      const [newCompletes, newCount] = this.children[key]
        .getCompleteChildren(progress + key, limit, currentCount);

      completeChildren = completeChildren.concat(newCompletes);
      currentCount = newCount;
    }
    return [completeChildren, currentCount];
  }

  getCompleteRemaindersFrom(start = '', limit = 5) {
    const lowered = start.toLowerCase();
    const branch = this.get(lowered, true);
    return branch === null ? [] : branch.getCompleteChildren('', limit)[0];
  }
}
