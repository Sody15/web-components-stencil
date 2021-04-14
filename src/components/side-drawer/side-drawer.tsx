import { Component, h, Method, Prop, State } from '@stencil/core';

type ContentType = 'nav' | 'contact';

@Component({
  tag: 'ps-side-drawer',
  styleUrl: './side-drawer.scss',
  shadow: true,
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string;
  @Prop({ reflect: true, mutable: true }) opened: boolean;
  @State() contentSelected: ContentType = 'nav';

  onCloseDrawer() {
    this.opened = false;
  }

  onContentChange(content: ContentType) {
    this.contentSelected = content;
  }

  // Make publicly available method
  @Method()
  open() {
    this.opened = true;
  }

  render() {
    let mainContent = <slot />;
    if (this.contentSelected === 'contact') {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 4912039123</li>
            <li>
              Email: <a href="mailto:something@something.com">something@something.com</a>
            </li>
          </ul>
        </div>
      );
    }

    return [
      <div class="backdrop" onClick={this.onCloseDrawer.bind(this)}></div>,
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.onCloseDrawer.bind(this)}>X</button>
        </header>
        <section id="tabs">
          <button class={this.contentSelected === 'nav' ? 'active' : ''} onClick={this.onContentChange.bind(this, 'nav')}>
            Navigation
          </button>
          <button class={this.contentSelected === 'contact' ? 'active' : ''} onClick={this.onContentChange.bind(this, 'contact')}>
            Contact
          </button>
        </section>
        <main>{mainContent}</main>
      </aside>,
    ];
  }
}
