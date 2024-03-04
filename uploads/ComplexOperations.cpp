#include <iostream>
using namespace std;

int factorial(int n) {
    if (n <= 1) return 1;
    else return n * factorial(n - 1);
}

int main() {
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 0) cout << "Even: " << i << endl;
        else if (i % 3 == 0) cout << "Divisible by 3: " << i << endl;
        else cout << i << endl;
    }
    cout << "Factorial of 5: " << factorial(5) << endl;
    return 0;
}
