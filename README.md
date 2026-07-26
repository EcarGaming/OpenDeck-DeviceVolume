# OpenDeck Device Volume

Control the volume of any PipeWire output device directly from OpenDeck.

## Features

- Select any available PipeWire output device.
- Increase the volume.
- Decrease the volume.
- Automatically detects physical and virtual PipeWire output devices.
- Supports USB audio interfaces, HDMI outputs, analog sound cards and virtual sinks.

## Requirements

- Linux
- PipeWire
- OpenDeck
- `wpctl`

## Installation

1. Download the latest release.
2. Install the plugin in OpenDeck.
3. Restart OpenDeck.
4. Add a **Volume Up** or **Volume Down** action to your deck.
5. Select the output device from the dropdown list.

## Supported Devices

Examples:

- PipeWire virtual sinks
- HDMI audio outputs
- USB audio interfaces
- Analog sound cards
- Elgato Wave XLR

## How it works

The plugin queries available output devices using:

```bash
wpctl status
```

Volume changes are performed using:

```bash
wpctl set-volume
```

## Compatibility

Tested on:

- Bazzite Linux
- PipeWire
