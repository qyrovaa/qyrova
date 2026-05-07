export const embeddedHardcore = [

`Explain the complete boot process from power-on reset to main() execution.`,

`What happens at assembly level when an interrupt occurs?`,

`Explain vector table and how ISR mapping works.`,

`How does context saving happen during an interrupt?`,

`What is the difference between pre-emptive and cooperative scheduling internally?`,

`How would you implement your own scheduler in bare-metal?`,

`Explain how stack overflow detection can be implemented in firmware.`,

`What are reentrant functions? Why are they important in embedded systems?`,

`Explain memory alignment and padding in structures.`,

`How does cache affect embedded system performance?`,

`Write a C macro to set, clear and toggle a specific bit in a register.`,

`What happens if two ISRs try to access the same global variable?`,

`How would you design a circular buffer for UART communication?`,

`Explain volatile vs atomic operations.`,

`What is memory barrier? Why is it required in multi-core embedded systems?`,

`Given this code, identify the issue:
int flag = 0;

void ISR() {
    flag = 1;
}

int main() {
    while(flag == 0);
}`,

`How would you debug a system that works in debug mode but fails in release mode?`,

`MCU works fine on bench but fails in field. Possible reasons?`,

`Explain brown-out detection and why it matters.`,

`What is EMI/EMC and how does it impact embedded hardware?`,

`How do you calculate worst-case execution time (WCET)?`,

`What is priority inversion? Explain priority inheritance mechanism deeply.`,

`Explain how heap fragmentation occurs and how to prevent it.`,

`How would you implement a bootloader for firmware update?`,

`Explain secure boot in embedded systems.`,

`How does DMA interact with CPU and memory bus?`,

`Explain watchdog recovery mechanism in safety-critical systems.`,

`How would you design firmware for an automotive real-time braking system?`,

`What is MISRA C? Why is it important?`,

`Explain how you would perform root cause analysis for a random firmware crash.`

];