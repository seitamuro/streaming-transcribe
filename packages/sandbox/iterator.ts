function* generatorFunction1(name: string) {
  yield "My";
  yield "name";
  yield "is";
  yield name;
  return name;
}

const generator1 = generatorFunction1("John");
for (const v of generator1) {
  console.log(v);
}

const anotherGenerator1 = generatorFunction1("John");
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
console.log(anotherGenerator1.next());
