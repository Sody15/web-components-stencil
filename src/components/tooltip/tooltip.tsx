import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'ps-tooltip',
  styleUrl: './tooltip.scss',
  shadow: true,
})
export class Tooltip {
  @Prop() text: string;
  @State() visible = false;

  onToggleTooltip() {
    this.visible = !this.visible;
  }

  close() {
    this.visible = false;
  }

  render() {
    // Tooltip
    let tooltip = null;
    if (this.visible) {
      tooltip = (
        <div class="tooltip-text">
          {this.text}
          <span class="tooltip-text__close-btn" onClick={this.close.bind(this)}>
            X
          </span>
        </div>
      );
    }

    return [
      <slot />,
      <span class="tooltip-icon" onClick={this.onToggleTooltip.bind(this)}>
        ?
      </span>,
      tooltip,
    ];
  }
}
