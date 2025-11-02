#!/usr/bin/env python3
"""
Memory log analyzer for Scheduled-Countdown
Reads memory.csv and generates plots showing memory usage over time.

Usage:
  python memory-analyze.py [path/to/memory.csv]

Dependencies:
  pip install pandas matplotlib
"""

import sys
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

def load_memory_log(filepath='./logs/memory.csv'):
    """Load and parse the memory.csv file."""
    try:
        df = pd.read_csv(filepath)
        df['time'] = pd.to_datetime(df['time_iso'])
        return df
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        sys.exit(1)

def plot_memory_usage(df, save_path='./logs/memory-analysis.png'):
    """Generate a multi-panel plot showing memory metrics over time."""
    # Create figure with subplots
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
    fig.suptitle('Memory Usage Analysis', fontsize=14)

    # Convert bytes to MB for readability
    mb = 1024 * 1024
    
    # Plot 1: Heap Usage
    ax1.plot(df['time'], df['heapUsed'] / mb, 'b-', label='Heap Used')
    ax1.plot(df['time'], df['heapTotal'] / mb, 'r--', label='Heap Total')
    ax1.set_ylabel('Heap (MB)')
    ax1.grid(True)
    ax1.legend()

    # Plot 2: RSS (Resident Set Size)
    ax2.plot(df['time'], df['rss'] / mb, 'g-')
    ax2.set_ylabel('RSS (MB)')
    ax2.grid(True)

    # Plot 3: Heap Usage %
    ax3.plot(df['time'], df['heapUsed_pct'], 'purple')
    ax3.set_ylabel('Heap Used %')
    ax3.set_xlabel('Time')
    ax3.grid(True)
    
    # Add thresholds
    ax3.axhline(y=70, color='yellow', linestyle='--', alpha=0.5)
    ax3.axhline(y=85, color='red', linestyle='--', alpha=0.5)

    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45)
    
    # Adjust layout and save
    plt.tight_layout()
    
    try:
        # Ensure output directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        print(f"Plot saved to: {save_path}")
        
        # Generate summary statistics
        duration = df['time'].max() - df['time'].min()
        print("\nAnalysis Summary:")
        print(f"Time span: {duration}")
        print(f"Sample count: {len(df)}")
        print("\nHeap Usage (MB):")
        print(f"  Min: {df['heapUsed'].min() / mb:.1f}")
        print(f"  Max: {df['heapUsed'].max() / mb:.1f}")
        print(f"  Avg: {df['heapUsed'].mean() / mb:.1f}")
        print("\nRSS (MB):")
        print(f"  Min: {df['rss'].min() / mb:.1f}")
        print(f"  Max: {df['rss'].max() / mb:.1f}")
        print(f"  Avg: {df['rss'].mean() / mb:.1f}")
        
    except Exception as e:
        print(f"Error saving plot: {e}")

def main():
    # Use provided path or default
    csv_path = sys.argv[1] if len(sys.argv) > 1 else './logs/memory.csv'
    if not os.path.exists(csv_path):
        print(f"Error: File not found: {csv_path}")
        sys.exit(1)
        
    df = load_memory_log(csv_path)
    plot_memory_usage(df)

if __name__ == '__main__':
    main()