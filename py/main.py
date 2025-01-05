import json

def process_json_file(input_file, output_file):
    try:
        # Read the JSON file
        with open(input_file, 'r') as file:
            data = json.load(file)

        # Process each dictionary in the list
        for item in data:
            if 'e' in item:
                if isinstance(item['e'], str):
                    item['e'] = item['e'].lower()
                elif isinstance(item['e'], list):
                    item['e'] = [elem.lower() if isinstance(elem, str) else elem for elem in item['e']]

        # Write the modified data to the output file
        with open(output_file, 'w') as file:
            json.dump(data, file, indent=4)

        print(f"Processed JSON saved to {output_file}")

    except FileNotFoundError:
        print(f"Error: The file {input_file} does not exist.")
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON. Ensure the input file is a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Example usage
input_file = '../assets/searchEmoji.json'   # Replace with your input file name
output_file = 'output.json' # Replace with your output file name
process_json_file(input_file, output_file)
