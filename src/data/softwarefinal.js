export const softwareFinal = [
`What will be printed?
int x = 5;
System.out.println(x++ + ++x);`,

`Explain SOLID principles with practical examples.`,

`What is the difference between HashMap and ConcurrentHashMap?`,

`What will be printed?
String s1 = "Java";
String s2 = new String("Java");
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));`,

`How does a HashMap work internally?`,

`What is time complexity? What is the time complexity of searching in:
Array
Linked List
HashMap`,

`What will be printed?
class A {
    static {
        System.out.println("Static");
    }
    A() {
        System.out.println("Constructor");
    }
}
public class Main {
    public static void main(String[] args) {
        A a1 = new A();
        A a2 = new A();
    }
}`,

`What is the difference between abstraction and encapsulation?`,

`Explain how garbage collection works in JVM.`,

`What will be printed?
int x = 3;
switch(x){
    case 1: System.out.print("One");
    case 3: System.out.print("Three");
    case 5: System.out.print("Five");
}`,

`What is a race condition? How can you prevent it?`,

`What is the difference between synchronized block and synchronized method?`,

`What will be printed?
Integer a = 127;
Integer b = 127;
System.out.println(a == b);`,

`What is REST? What are common HTTP methods?`,

`What is the difference between SQL and NoSQL databases?`,

`What will be printed?
int[] arr = {1,2,3};
for(int i : arr){
    i = i * 2;
}
System.out.println(arr[0]);`,

`What is normalization in databases?`,

`Explain the difference between composition and inheritance.`,

`What will be printed?
int x = 1;
while(x < 5){
    x *= 2;
}
System.out.println(x);`,

`What is multithreading? What happens during context switching?`,

`Design a basic URL shortener. What components are required?`,

`What will be printed?
char c = 'Z';
c++;
System.out.println(c);`,

`What is the difference between PUT and PATCH?`,

`What is caching and where would you use it?`,

`What will be printed?
int a = 10;
int b = 20;
System.out.println(a > b ? a : b > 15 ? b : 30);`,

`What is deadlock? Give a real example.`,

`Explain the difference between shallow copy and deep copy.`,

`What will be printed?
int x = 0;
System.out.println(x++ == ++x);`,

`How would you scale a web application to handle 10x traffic?`,

`If production server suddenly slows down, how would you debug it?`
];