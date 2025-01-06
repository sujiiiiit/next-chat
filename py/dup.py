import json

def remove_duplicates_from_file(input_file_path, output_file_path):
    # Load the JSON data from the input file
    with open(input_file_path, 'r') as file:
        data = json.load(file)
    
    # Remove duplicates in the "e" key for each object in the list
    for item in data:
        if "e" in item and isinstance(item["e"], list):
            item["e"] = list(dict.fromkeys(item["e"]))
    
    # Save the updated JSON to a new file
    with open(output_file_path, 'w') as file:
        json.dump(data, file, indent=4)
    
    print(f"Duplicates removed. Updated data saved to {output_file_path}")

# Example usage
input_file = "../src/assets/searchEmoji.json"  # Replace with your input file path
output_file = "output.json"  # Replace with your desired output file path
remove_duplicates_from_file(input_file, output_file)
