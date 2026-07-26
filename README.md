# OpenDeck Device Volume

Control the volume of individual PipeWire output devices directly from OpenDeck.

## Features

- Control the volume of any PipeWire output device.
- Increase and decrease volume.
- Mute and unmute devices.
- Automatically detects all available PipeWire sinks.
- Supports physical audio devices, USB interfaces, HDMI outputs and virtual PipeWire sinks.
- Automatically selects the current default output device.

## Requirements

- Linux
- PipeWire
- OpenDeck
- `wpctl` installed and available in your PATH

## Installation

1. Download the latest release.
2. Install the plugin in OpenDeck.
3. Restart OpenDeck.
4. Add one of the Device Volume actions to your deck.
5. Select the desired output device from the dropdown list.

## Supported Devices

Examples include:

- PipeWire virtual sinks
- HDMI audio
- USB audio interfaces
- Analog sound cards
- Elgato Wave XLR

## How it works

The plugin reads available output devices using:

```bash
wpctl status
```

Volume is controlled using:

```bash
wpctl set-volume
```

Mute is controlled using:

```bash
wpctl set-mute
```

## Compatibility

Tested on:

- Bazzite Linux
- PipeWire

Other Linux distributions using PipeWire should also work.
