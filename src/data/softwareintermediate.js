export const softwareIntermediate = [
`What will be printed?
int x = 10;
System.out.println(x++ + x++ + ++x);`,

`Explain SOLID principles briefly.`,

`What will be printed?
String a = "Hello";
String b = new String("Hello");
System.out.println(a.equals(b));
System.out.println(a == b);`,

`What is Dependency Injection and why is it useful?`,

`What will be printed?
int[] arr = {1,2,3,4};
for(int i : arr){
    i = i * 2;
}
System.out.println(arr[2]);`,

`Difference between HashMap and TreeMap.`,

`What happens when this runs?
try{
    return;
}
finally{
    System.out.println("Finally");
}`,

`What is indexing in databases?`,

`What will be printed?
Integer a = 128;
Integer b = 128;
System.out.println(a == b);
System.out.println(a.equals(b));`,

`What is a race condition?`,

`What will be printed?
int count = 0;
for(int i=1; i<=3; i++){
    for(int j=1; j<=i; j++){
        count++;
    }
}
System.out.println(count);`,

`Difference between PUT and PATCH.`,

`What will be printed?
String s1 = "Ja";
String s2 = "va";
String s3 = s1 + s2;
String s4 = "Java";
System.out.println(s3 == s4);`,

`Explain ACID properties.`,

`What will be printed?
class A{
    static int x = 5;
}
A a1 = new A();
A a2 = new A();
a1.x = 20;
System.out.println(a2.x);`,

`Explain dynamic programming in simple terms.`,

`What will be printed?
int x = 5;
if(x > 2)
    if(x < 10)
        System.out.println("A");
    else
        System.out.println("B");`,

`Difference between authentication and authorization.`,

`What will be printed?
final int x = 10;
System.out.println(x);`,

`What is microservices architecture?`,

`What will be printed?
int x = 1;
while(x < 5){
    x *= 2;
}
System.out.println(x);`,

`What is caching and why is it used?`,

`What will be printed?
char c = 'Z';
c++;
System.out.println(c);`,

`Difference between checked and unchecked exceptions.`,

`What will be printed?
int x = 3;
switch(x){
    case 1: System.out.print("One");
    case 2: System.out.print("Two");
    default: System.out.print("Default");
}`,

`Explain deadlock with an example.`,

`What will be printed?
int a = 5;
int b = 10;
System.out.println(a > b ? a : b > 15 ? b : 20);`,

`Difference between BFS and DFS.`,

`What will be printed?
static int fun(int n){
    if(n == 1) return 1;
    return n * fun(n-1);
}
System.out.println(fun(4));`,

`What is JWT and how does it work?`
];