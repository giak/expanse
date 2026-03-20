import sys
import os
import json
import subprocess

# === LANCEUR HÔTE EXPANSE V8.0 (Jarvis / Osmose Dualiste) ===
# Script intermédiaire pour l'injection environnementale pré-inférence.
# Ce script doit être exécuté par l'humain avant d'ouvrir la session IDE.
# Il simule l'action d'un serveur MCP natif.

def query_mcp(method, params):
    """Dialogue avec le serveur MCP Mnemolite en JSON-RPC sur stdio."""
    try:
        proc = subprocess.Popen(
            ["bash", "/home/giak/Work/MnemoLite/scripts/mcp_server.sh"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={"DOCKER_COMPOSE_PROJECT": "mnemolite", **os.environ},
            text=True
        )
        
        # Init
        init_req = {
            "jsonrpc": "2.0", "id": 1, "method": "initialize",
            "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "Expanse V8", "version": "8.0"}}
        }
        
        if proc.stdin and proc.stdout:
            proc.stdin.write(json.dumps(init_req) + "\n")
            proc.stdin.flush()
            proc.stdout.readline() # Consume init response
            
            proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
            proc.stdin.flush()
            
            # Request
            req = {
                "jsonrpc": "2.0", "id": 2, "method": method, "params": params
            }
            proc.stdin.write(json.dumps(req) + "\n")
            proc.stdin.flush()
            
            response = proc.stdout.readline()
        else:
            response = None
            
        proc.terminate()
        proc.wait(timeout=2)
        
        if response:
            return json.loads(response)
        return None
    except Exception as e:
        print(f"[Avertissement MCP] {e}")
        return None

def fetch_user_anchor():
    """Récupère l'identité fondatrice (Le Profil via MCP)."""
    resp = query_mcp("tools/call", {
        "name": "search_memory",
        "arguments": {"query": "giak", "tags": ["sys:anchor", "giak"]}
    })
    
    if resp and "result" in resp and "content" in resp["result"]:
        content_json = resp["result"]["content"][0]["text"]
        try:
            data = json.loads(content_json)
            if data.get("memories"):
                # On prend le premier
                preview = data["memories"][0].get("content_preview", "")
                return f"> [USER_ANCHOR]: {preview}"
        except Exception:
            pass
            
    # Fallback si erreur serveur
    return "> [USER_ANCHOR]: Échec de récupération MCP. Mode dégradé (Amnésie Identitaire)."

def fetch_psi_nexus():
    """Récupère la mémoire d'état du projet local."""
    nexus_path = os.path.join(os.getcwd(), ".expanse", "psi_nexus.md")
    if os.path.exists(nexus_path):
        try:
            with open(nexus_path, "r", encoding="utf-8") as f:
                content = f.read()
            return f"> [PSI_NEXUS]:\n{content}"
        except Exception as e:
            return f"> [PSI_NEXUS]: Erreur de lecture du Nexus ({e})."
    return "> [PSI_NEXUS]: Vierge. Aucun contexte immédiat."

def fetch_memory_patterns(user_input):
    """RAG sur Mnemolite pour injecter les souvenirs émergents (L'Apprentissage)."""
    if not user_input.strip():
        return "> [EMERGENT_PATTERNS]: Aucun input, aucune résonance."
        
    resp = query_mcp("tools/call", {
        "name": "search_memory",
        "arguments": {"query": user_input, "tags": ["sys:pattern"], "limit": 2} # Uniquement les patterns appris
    })
    
    output = "> [EMERGENT_PATTERNS]:"
    found = False
    if resp and "result" in resp and "content" in resp["result"]:
        content_json = resp["result"]["content"][0]["text"]
        try:
            data = json.loads(content_json)
            if data.get("memories"):
                for mem in data["memories"]:
                    preview = mem.get("content_preview", "").replace("\n", " ")
                    title = mem.get("title", "Pattern")
                    output += f"\n> - {title}: {preview}"
                    found = True
        except Exception:
            pass
            
    if not found:
        return output + "\n> Aucune résonance vectorielle détectée pour cette tâche."
        
    return output

def build_v8_prompt(user_input):
    """Assemble le KERNEL statique avec l'environnement dynamique."""
    template_path = os.path.join(os.getcwd(), "prompts", "expanse-system-v8.md")
    
    if not os.path.exists(template_path):
        print(f"[ERREUR ABSOLUE] KERNEL introuvable ({template_path}).")
        sys.exit(1)
        
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()
    
    prompt = template.replace("{{USER_ANCHOR_INJECTION}}", fetch_user_anchor())
    prompt = prompt.replace("{{NEXUS_INJECTION}}", fetch_psi_nexus())
    prompt = prompt.replace("{{PATTERN_INJECTION}}", fetch_memory_patterns(user_input))
    
    return prompt

if __name__ == "__main__":
    print("∇ Lancement de l'Hôte EXPANSE (Injection V8.0)...")
    
    print("\n[HUMAIN] Entrez votre premier prompt (ex: 'On a une erreur cors sur la route api...') :")
    try:
        user_input = input("> ")
    except EOFError:
        user_input = ""
        
    final_system_prompt = build_v8_prompt(user_input)
    
    out_dir = os.path.join(os.getcwd(), ".expanse")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "compiled_boot.md")
    
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(final_system_prompt)
        f.write(f"\n\n---\n## INPUT UTILISATEUR IMMÉDIAT\n{user_input}\n")
    
    print(f"\n[OK] L'ADN V8.0 a été forgé dans: {out_file}")
    print("-> Pour démarrer EXPANSE, collez le contenu de ce fichier en premier message dans l'IDE.")
