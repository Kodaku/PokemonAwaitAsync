import Phaser from 'phaser';
import { pokedexNumbers } from '~/constants/Constants';
export default class MenuPreloader extends Phaser.Scene {
  constructor() {
    super('menu-preloader');
  }

  preload() {
    this.load.image(
      'icon-bag-female-selected',
      'menu/icon_bag_female_selected.png'
    );
    this.load.image(
      'icon-bag-female-unselected',
      'menu/icon_bag_female_unselected.png'
    );
    this.load.image(
      'icon-bag-male-selected',
      'menu/icon_bag_male_selected.png'
    );
    this.load.image(
      'icon-bag-male-unselected',
      'menu/icon_bag_male_unselected.png'
    );
    this.load.image('icon-card-selected', 'menu/icon_card_selected.png');
    this.load.image('icon-card-unselected', 'menu/icon_card_unselected.png');
    this.load.image('icon-party-selected', 'menu/icon_party_selected.png');
    this.load.image('icon-party-unselected', 'menu/icon_party_unselected.png');
    this.load.image('option-selected', 'menu/option_selected.png');
    this.load.image('option-unselected', 'menu/option_unselected.png');
    this.load.image('panel-selected', 'menu/panel_selected.png');
    this.load.image('panel-unselected', 'menu/panel_unselected.png');
    this.load.image('pokedex-selected', 'menu/pokedex_selected.png');
    this.load.image('pokedex-unselected', 'menu/pokedex_unselected.png');
    this.load.image('save-selected', 'menu/save_selected.png');
    this.load.image('save-unselected', 'menu/save_unselected.png');
    this.load.image('menu', 'menu/menubg.png');
    this.load.image('exit-1', 'menu/exit_1.png');

    for (let i of pokedexNumbers) {
      this.load.atlas(
        `icon${i}`,
        `party/pokemon_icons/${i}/icon${i}.png`,
        `party/pokemon_icons/${i}/icon${i}_atlas.json`
      );
    }

    //Party Menu
    this.load.image('party-bg', 'party/partybg.png');
    this.load.image('party-hp-bar', 'party/advHPbar.png');
    this.load.image('party-active', 'party/advPartyActive.png');
    this.load.image('party-active-faint', 'party/advPartyActiveFnt.png');
    this.load.image('party-active-faint-sel', 'party/advPartyActiveFntSel.png');
    this.load.image('party-active-sel', 'party/advPartyActiveSel.png');
    this.load.image('party-active-swap', 'party/advPartyActiveSwap.png');
    this.load.image('party-active-swap-sel', 'party/advPartyActiveSwapSel.png');
    this.load.image('party-inactive-faint', 'party/advPartyInactiveFnt.png');
    this.load.image('party-inactive-sel', 'party/advPartyInactiveSel.png');
    this.load.image('command-sel', 'party/command_selected.png');
    this.load.image('command-unsel', 'party/command_unselected.png');
    this.load.image('party-male', 'party/male.png');
    this.load.image('party-female', 'party/female.png');

    //Bag Menu
    this.load.atlas(
      'left-light-arrow',
      'bag/arrows/left_light_arrow.png',
      'bag/arrows/left_light_arrow_atlas.json'
    );
    this.load.atlas(
      'right-light-arrow',
      'bag/arrows/right_light_arrow.png',
      'bag/arrows/right_light_arrow_atlas.json'
    );
    this.load.atlas(
      'bag1-f',
      'bag/bag_anims/bag1_f.png',
      'bag/bag_anims/bag1_f_atlas.json'
    );
    this.load.atlas(
      'bag1-m',
      'bag/bag_anims/bag1_m.png',
      'bag/bag_anims/bag1_m_atlas.json'
    );
    this.load.atlas(
      'bag2-f',
      'bag/bag_anims/bag2_f.png',
      'bag/bag_anims/bag2_f_atlas.json'
    );
    this.load.atlas(
      'bag2-m',
      'bag/bag_anims/bag2_m.png',
      'bag/bag_anims/bag2_m_atlas.json'
    );
    this.load.atlas(
      'bag3-f',
      'bag/bag_anims/bag3_f.png',
      'bag/bag_anims/bag3_f_atlas.json'
    );
    this.load.atlas(
      'bag3-m',
      'bag/bag_anims/bag3_m.png',
      'bag/bag_anims/bag3_m_atlas.json'
    );
    this.load.atlas(
      'bag4-f',
      'bag/bag_anims/bag4_f.png',
      'bag/bag_anims/bag4_f_atlas.json'
    );
    this.load.atlas(
      'bag4-m',
      'bag/bag_anims/bag4_m.png',
      'bag/bag_anims/bag4_m_atlas.json'
    );
    this.load.atlas(
      'bag5-f',
      'bag/bag_anims/bag5_f.png',
      'bag/bag_anims/bag5_f_atlas.json'
    );
    this.load.atlas(
      'bag5-m',
      'bag/bag_anims/bag5_m.png',
      'bag/bag_anims/bag5_m_atlas.json'
    );
    this.load.image('item-selected', 'bag/commands/item_selected.png');
    this.load.image('item-unselected', 'bag/commands/item_unselected.png');
    this.load.image('ball-icon', 'bag/icons/ball.png');
    this.load.image('hm-icon', 'bag/icons/hm.png');
    this.load.image('msg-icon', 'bag/icons/msg.png');
    this.load.image('obj-icon', 'bag/icons/obj.png');
    this.load.image('tm-icon', 'bag/icons/tm.png');
    this.load.image('bg-down-f', 'bag/background/bagbgdownf.png');
    this.load.image('bg-down-m', 'bag/background/bagbgdown.png');
    this.load.image('bag-slider', 'bag/background/bagSlider.png');
  }

  create() {
    this.scene.start('empty-menu', {
      sceneName: 'menu-preloader',
    });
  }
}
