public class ComplexOperations {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                System.out.println("Even: " + i);
            } else if (i % 3 == 0) {
                System.out.println("Divisible by 3: " + i);
            } else {
                System.out.println(i);
            }
        }
        System.out.println("Factorial of 5: " + factorial(5));
    }

    public static int factorial(int n) {
        if (n <= 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
}
