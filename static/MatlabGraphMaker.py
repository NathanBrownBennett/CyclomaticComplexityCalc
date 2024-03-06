import sys
import numpy as np

import matplotlib.pyplot as plt

# Assuming inputs are app name and a simplified result
app_name = sys.argv[1]
analysis_result = sys.argv[2]  # This would be more complex in reality

if app_name == 'CCCalc':
    # Generate Cyclomatic Complexity Graph
    complexities = list(map(int, analysis_result.split(',')))
    plt.plot(complexities)
    plt.title('Cyclomatic Complexity Graph')
elif app_name == 'O[n]calc':
    # Generate O[N] Complexity Line Graph
    points = list(map(int, analysis_result.split(',')))
    plt.plot(points)
    plt.title('O[N] Complexity Graph')
elif app_name == 'LineCounter':
    # Generate Bar Chart for Line Count vs. Most Common Function
    data = analysis_result.split(',')
    lines, function = int(data[0]), data[1]
    plt.bar(['Lines', 'Function Calls'], [lines, 100])  # Example data
    plt.title('Line Count and Function Calls')
elif app_name == 'SuperMetric':
    # Combine metrics somehow
    # For this example, we're just generating a random graph. You'll need to replace this with your actual logic.
    plt.plot(np.random.rand(10))
    plt.title('SuperMetric Graph')

# Save the graph as a png file
plt.savefig('/path/to/output/graph.png')

# Print the path of the saved graph. This can be used in your script.js to load the graph into the iframe.
print('/path/to/output/graph.png')
