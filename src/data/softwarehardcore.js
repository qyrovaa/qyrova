export const softwareHardcore = [
`What will be printed?
int x = 5;
System.out.println(x++ + ++x + x++ + ++x);`,

`Explain how HashMap works internally in Java. Include hashing, buckets, collision handling, and resizing.`,

`What will be printed?
String s1 = "Java";
String s2 = "Ja" + "va";
String s3 = new String("Java");
System.out.println(s1 == s2);
System.out.println(s1 == s3);
System.out.println(s1.equals(s3));`,

`How does garbage collection work in JVM? What is the difference between Minor GC and Major GC?`,

`What will be printed?
int[] arr = {1,2,3,4};
change(arr);
System.out.println(arr[0]);

static void change(int[] arr){
    arr[0] = 100;
}`,

`What is the difference between Comparable and Comparator?`,

`What will be printed?
class Test{
    static{
        System.out.println("Static");
    }
    {
        System.out.println("Instance");
    }
    Test(){
        System.out.println("Constructor");
    }
}
public class Main{
    public static void main(String[] args){
        Test t1 = new Test();
        Test t2 = new Test();
    }
}`,

`Explain how multithreading works internally. What happens during context switching?`,

`What will be printed?
Integer a = 100;
Integer b = 100;
Integer c = 200;
Integer d = 200;
System.out.println(a == b);
System.out.println(c == d);`,

`What is the difference between synchronized block and synchronized method?`,

`What will be printed?
int x = 0;
System.out.println(x++ == ++x);`,

`How does database indexing actually speed up queries internally?`,

`What will be printed?
String s = null;
System.out.println(s + "Java");`,

`What is CAP theorem in distributed systems?`,

`What will be printed?
try{
    System.out.println("Try");
    throw new RuntimeException();
}
catch(Exception e){
    System.out.println("Catch");
}
finally{
    System.out.println("Finally");
}`,

`What is the difference between shallow copy and deep copy? Explain with object references.`,

`What will be printed?
int x = 3;
switch(x){
    case 1: System.out.print("One");
    case 3: System.out.print("Three");
    case 5: System.out.print("Five");
}`,

`Explain deadlock with real multithreading example logic.`,

`What will be printed?
int a = 10;
int b = 20;
System.out.println(a > b ? a : b > 15 ? b : 30);`,

`How does JVM memory model work? Explain stack, heap, method area.`,

`What will be printed?
final int x = 10;
System.out.println(x++);`,

`Explain difference between REST and SOAP.`,

`What will be printed?
char c = 65535;
c++;
System.out.println((int)c);`,

`What is lazy loading vs eager loading (in ORM concept)?`,

`What will be printed?
static int fun(int n){
    if(n == 0) return 0;
    return n + fun(n--);
}
System.out.println(fun(3));`,

`Explain how JWT works internally. What are its three parts?`,

`What will be printed?
int x = 1;
for(System.out.print("A"); x < 3; System.out.print("C")){
    System.out.print("B");
    x++;
}`,

`What is thread starvation and livelock?`,

`What will be printed?
String s1 = "Java";
String s2 = s1.intern();
System.out.println(s1 == s2);`,

`Design a URL shortener like bit.ly. Explain high-level architecture.`
];