CC = clang++
CXXFLAGS = -std=c++17 -pthread

all: url_fixer.out

%.out: %.cc
	$(CC) $< -o $@ $(CXXFLAGS)

.PHONY: clean

clean:
	rm -f *.out

