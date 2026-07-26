# Device Volume Plugin for OpenDeck

Control the volume of any PipeWire output device directly from OpenDeck.

This plugin is designed for Linux systems using PipeWire and allows each action to control an individual output device, including virtual sinks.

## Features

- List all available PipeWire output devices automatically.
- Select any output device from a dropdown menu.
- Increase volume.
- Decrease volume.
- Mute output.
- Works with both physical devices and virtual sinks.
- Automatically detects the current default output device.

## Requirements

- Linux
- PipeWire
- `wpctl` available in your PATH

You can verify that `wpctl` is installed by running:

```bash
wpctl status
```

## Supported Devices

The plugin works with:

- Physical sound cards
- USB audio interfaces
- HDMI audio outputs
- Virtual PipeWire sinks

Examples:

- Elgato Wave XLR
- HDMI Audio
- PipeWire virtual sinks

## Installation

Copy the plugin into your OpenDeck plugins directory and restart OpenDeck.

## How It Works

The plugin reads the available output devices from:

```bash
wpctl status
```

Volume changes are performed using:

```bash
wpctl set-volume <device-id> <volume>
```

Mute is performed using:

```bash
wpctl set-mute <device-id> 1
```

The default output device is detected automatically by reading the active sink from `wpctl status`.

## Notes

This plugin does **not** change the default PipeWire output device.

Each action only controls the device selected in its settings.

# Device Volume Plugin for OpenDeck

Created by **EcarGaming**

Control the volume of any PipeWire output device directly from OpenDeck.