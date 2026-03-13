import sys
import json
import subprocess

def query_mcp(method, params):
    proc = subprocess.Popen(
        ["bash", "/home/giak/Work/MnemoLite/scripts/mcp_server.sh"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={"DOCKER_COMPOSE_PROJECT": "mnemolite"},
        text=True
    )
    
    # Initialize the server first
    init_req = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "Expanse V8", "version": "8.0"}
        }
    }
    proc.stdin.write(json.dumps(init_req) + "\n")
    proc.stdin.flush()
    proc.stdout.readline() # Read init response
    
    proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
    proc.stdin.flush()
    
    # Now send the actual request
    req = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": method,
        "params": params
    }
    proc.stdin.write(json.dumps(req) + "\n")
    proc.stdin.flush()
    
    response = proc.stdout.readline()
    proc.terminate()
    proc.wait()
    
    try:
        if response:
            return json.loads(response)
        return {"error": "Empty response"}
    except Exception as e:
        return {"error": str(e), "raw": response}

if __name__ == "__main__":
    print(query_mcp("tools/call", {
        "name": "search_memory",
        "arguments": {"query": "giak", "tags": ["sys:anchor", "profile"]}
    }))
