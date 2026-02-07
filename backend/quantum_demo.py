import json
import sys

from qiskit import QuantumCircuit, transpile
from qiskit.providers.basic_provider import BasicSimulator


def run_demo(shots=1024):
    qc = QuantumCircuit(3, 3)
    qc.h(0)
    qc.h(2)
    qc.cx(0, 1)
    qc.measure([0, 1, 2], [0, 1, 2])

    backend = BasicSimulator()
    compiled = transpile(qc, backend)
    result = backend.run(compiled, shots=shots).result()
    return result.get_counts()


if __name__ == "__main__":
    shots = 1024
    if len(sys.argv) > 1:
        shots = int(sys.argv[1])

    counts = run_demo(shots)
    print(json.dumps(counts))
