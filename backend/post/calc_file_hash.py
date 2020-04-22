import hashlib

def calc_file_hash(path):
	f = open(path, 'rb')
	data = f.read()
	hash = hashlib.md5(data).hexdigest()
	return hash

if __name__ == "__main__":
	hash_val = calc_file_hash("/path/to/file")
	print(hash_val)
