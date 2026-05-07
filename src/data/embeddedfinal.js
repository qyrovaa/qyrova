export const embeddedInterviewMixed = [

`What is an embedded system? How is it different from a general-purpose system?`,

`Explain microcontroller vs microprocessor with practical examples.`,

`Describe the internal architecture of a microcontroller.`,

`What happens from power-on reset till main() executes?`,

`What is a linker script and why is it important in embedded development?`,

`Explain interrupt handling flow at hardware and software level.`,

`What is interrupt latency? How can you reduce it?`,

`What are reentrant functions? Why must ISRs be reentrant-safe?`,

`What is the purpose of the volatile keyword? Give a real failure case.`,

`What is memory-mapped I/O?`,

`Write a C macro to set and clear a particular bit in a register.`,

`Explain stack vs heap with respect to embedded constraints.`,

`Why is dynamic memory allocation risky in embedded systems?`,

`What is memory alignment? How does padding affect structure size?`,

`What is endianness? When does it matter?`,

`Explain I2C, SPI, and UART differences with use cases.`,

`What is DMA? When would you prefer DMA over interrupt-based transfer?`,

`Design a circular buffer for UART communication.`,

`Sensor data is noisy — what hardware and software techniques will you use?`,

`System randomly resets in field but not in lab. How will you debug?`,

`Explain RTOS scheduling (preemptive vs cooperative).`,

`What is priority inversion? How does priority inheritance solve it?`,

`What is a deadlock? How can it occur in embedded RTOS?`,

`How do you measure execution time of a function in firmware?`,

`What tools have you used for debugging? (JTAG, Oscilloscope, Logic Analyzer, etc.)`,

`Given this code, find the issue:
int flag = 0;
void ISR() { flag = 1; }
int main() { while(flag == 0); }`,

`How would you reduce power consumption in a battery-operated device?`,

`Explain watchdog timer strategy in safety-critical applications.`,

`What is MISRA C and why do automotive companies enforce it?`,

`Explain one embedded project in detail — architecture, communication, challenges, debugging steps.`

];