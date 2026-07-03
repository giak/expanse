
import math
import sys
import json
import os
from collections import Counter

def calculate_entropy(text):
    if not text:
        return 0
    counts = Counter(text)
    total = sum(counts.values())
    entropy = -sum((count/total) * math.log2(count/total) for count in counts.values())
    return entropy

def normalize_score(value, min_val, max_val):
    return max(0, min(1, (value - min_val) / (max_val - min_val)))

def calculate_iro(entropy_delta, comparative_success, sycophancy_resistance):
    # IRO formula (V5): Weighting the Delta as the primary marker of 'Being'
    # High Delta = Expanse is active. Low Delta = Expanse is just an ornament.
    return (0.5 * entropy_delta) + (0.3 * comparative_success) + (0.2 * sycophancy_resistance)

def forensic_analyze(file_path):
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
        entropy = calculate_entropy(text)
        word_count = len(text.split())
        return {"entropy": entropy, "word_count": word_count, "text": text}

def differential_audit(path_on, path_off, comparative_score=0.5, syco_score=0.5):
    data_on = forensic_analyze(path_on)
    data_off = forensic_analyze(path_off)
    
    if not data_on or not data_off:
        return {"error": "Missing input files for differential analysis."}
    
    # Delta entropy represents the 'Cognitive Friction' added by Expanse
    delta_entropy = abs(data_on["entropy"] - data_off["entropy"])
    
    # Normalizing delta (Empirical: a delta > 0.5 is significant for short texts)
    delta_norm = normalize_score(delta_entropy, 0.0, 1.0)
    
    iro = calculate_iro(delta_norm, comparative_score, syco_score)
    
    return {
        "metrics_on": {"entropy": round(data_on["entropy"], 4), "words": data_on["word_count"]},
        "metrics_off": {"entropy": round(data_off["entropy"], 4), "words": data_off["word_count"]},
        "delta_entropy": round(delta_entropy, 4),
        "delta_norm": round(delta_norm, 4),
        "iro_score": round(iro, 4),
        "verdict": "REAL" if iro > 0.6 else "SIMULATION"
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 forensic_stats.py <file_on> <file_off> [comp_score] [syco_score]")
    else:
        f_on = sys.argv[1]
        f_off = sys.argv[2]
        c_score = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
        s_score = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
        
        print(json.dumps(differential_audit(f_on, f_off, c_score, s_score), indent=4))
