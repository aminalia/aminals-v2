// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {Genes} from "src/genes/Genes.sol";
import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

/**
 * @title InitialGenesMinter
 * @dev Temporary contract to mint initial genes for the Aminals ecosystem
 * This contract is deployed temporarily just to mint initial genes, then discarded
 */
contract InitialGenesMinter {
    /**
     * @notice Mint all initial Gene NFTs to seed the ecosystem 🧬
     * @param genes The Genes contract to mint to
     * @param recipient The address to mint genes to
     */
    function mintInitialGenesAnimated(Genes genes, address recipient) external {
        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        // CUTE ORANGEY

        genes.mint(
            recipient,
            ' <g id="BACK"><style>.st2{fill:#8b0}.st12{fill:#fff}.st13{fill:#281c28}.st14{fill:#848484}</style><path fill="#c1e0b6" d="M7 0H1007V1000H7z"/> <ellipse cx="498" cy="976" fill="#a4bf99" rx="164" ry="12"/><circle cx="146" cy="907" r="44" class="st2"/><circle cx="281" cy="874" r="10" class="st2"/> <circle cx="390" cy="828" r="6" class="st2"/><circle cx="463" cy="907" r="14" class="st2"/> <circle cx="572" cy="841" r="6" class="st2"/><circle cx="644" cy="824" r="16" class="st2"/><circle cx="719" cy="936" r="6" class="st2"/><circle cx="762" cy="821" r="7" class="st2"/><circle cx="825" cy="782" r="15" class="st2"/><circle cx="205" cy="549" r="28" class="st2"/> <circle cx="892" cy="600" r="40" class="st2"/> <circle cx="908" cy="726" r="6" class="st2"/><circle cx="933" cy="833" r="18" class="st2"/><circle cx="180" cy="664" r="19" class="st2"/><circle cx="808" cy="269" r="13" class="st2"/><circle cx="929" cy="916" r="35" class="st2"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genes.mint(
            recipient,
            '<g id="ARMS"><path fill="#f58531" d="m321 735 10-29 6-14 5-14-38-31-14 30-7 13-9 21-4 17c-1 8 0 17 4 24 5 7 14 12 22 12 8-1 14-6 17-11l8-18z"/><path fill="#e57125" d="M384 500c-8 15-73 131-80 147l38 31c11-26 64-154 65-170l-23-8z"/><path fill="#f58531" d="m685 716-13-31-7-16-6-14c14-11 27-23 39-36l17 32 8 13 11 23c3 6 4 12 5 18 2 9 1 18-3 26s-14 14-23 14c-8 0-15-5-19-11l-9-18z"/> <path fill="#e57125" d="M602 470c9 16 88 133 96 149-12 13-25 25-39 36C646 628 575 506 572 489l30-19z"/> </g>',
            IAminalStructs.VisualsCat.ARM
        );

        genes.mint(
            recipient,
            ' <g id="TAIL"><path fill="#e58440" d="M509 809c0 4-5 8-11 8s-11-4-11-8 5-8 11-8 11 4 11 8z"/> <path fill="#ad5026" d="M515 797c0 6-8 12-17 12s-17-6-17-12c0-7 8-13 17-13s17 6 17 13z"/> <path fill="#e67428" d="M532 769c0 14-15 25-34 25s-33-11-33-25 15-24 33-24 34 11 34 24z"/><path fill="#e58440" d="M543 739c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/> <path fill="#e67428" d="M543 706c0 18-20 33-45 33s-45-15-45-33 20-33 45-33 45 15 45 33z"/></g>',
            IAminalStructs.VisualsCat.TAIL
        );

        genes.mint(
            recipient,
            '<g id="EARS"><circle cx="355" cy="237" r="54" fill="#ed8741"/> <circle cx="355" cy="237" r="31" fill="#e57125"/><circle cx="643" cy="245" r="54" fill="#ed8741"/><circle cx="643" cy="245" r="31" fill="#e57125"/></g>',
            IAminalStructs.VisualsCat.EARS
        );

        genes.mint(
            recipient,
            '<path id="BODY" fill="#ed8741" d="M708 403c0 157-94 351-210 351S288 593 288 403c0-116 94-218 210-218S708 287 708 403z"/>',
            IAminalStructs.VisualsCat.BODY
        );

        genes.mint(
            recipient,
            '<g id="FACE"> <path fill="#f9a369" d="M671 351C671 426 645 462 496 466c-133 4-171-44-171-120S410 191 499 191s172 85 172 160z"/> <path fill="#944" d="M657 344c0 52-23 60-163 63-123 2-158-14-158-66s76-89 158-89 163 41 163 92z"/> <circle cx="371" cy="345" r="29" class="st12"/> <path d="M371 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/><ellipse cx="370" cy="335" class="st14" rx="18" ry="12"/><circle cx="357" cy="332" r="2" class="st12"/> <circle cx="362" cy="329" r="1" class="st12"/> <circle cx="624" cy="345" r="29" class="st12"/> <path d="M624 321a24 24 0 1 0 0 48 24 24 0 0 0 0-48zm-1 26c-10 0-18-5-18-12s8-12 18-12 18 6 18 12-8 12-18 12z" class="st13"/> <ellipse cx="623" cy="335" class="st14" rx="18" ry="12"/> <circle cx="610" cy="332" r="2" class="st12"/> <circle cx="615" cy="329" r="1" class="st12"/> </g>',
            IAminalStructs.VisualsCat.FACE
        );

        genes.mint(
            recipient,
            ' <g id="MOUTH"> <path fill="#412111" d="M527 353a33 33 0 0 1-66 0c0-18 15-16 33-16s33-2 33 16z"/> <path fill="#c96dab" d="M484 376a8 8 0 1 1 16 0c0 4-4 4-8 4s-8 0-8-4z"/></g>',
            IAminalStructs.VisualsCat.MOUTH
        );

        genes.mint(
            recipient,
            '<g id="MISC"> <path fill="#ffce07" d="m510 205 4 7c1 4 4 6 8 6l8 2c9 1 13 12 6 19l-6 5a11 11 0 0 0-3 10l1 8c2 9-8 16-16 12l-7-4a11 11 0 0 0-10 0l-7 4c-8 4-18-3-16-12l1-8c1-4-1-7-3-10l-6-5c-7-7-3-18 6-19l8-2a11 11 0 0 0 8-6l4-7c4-8 16-8 20 0z"/><path fill="#fff" d="m506 220 2 4c1 2 3 4 5 4l5 1c6 1 8 8 4 12l-3 3a7 7 0 0 0-2 6v5c1 5-4 10-10 7l-4-2h-6l-4 2c-6 3-11-2-10-7v-5c1-2 0-5-2-6l-3-3c-4-4-2-11 4-12l5-1a7 7 0 0 0 5-4l2-4c2-5 10-5 12 0z"/><path fill="#ffce07" d="m453 240 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-4-2a6 6 0 0 0-5 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0zm104 0 2 4a6 6 0 0 0 4 3h4c4 1 6 7 3 10l-3 3a6 6 0 0 0-2 4l1 4c1 5-4 8-8 6l-3-2a6 6 0 0 0-6 0l-3 2c-4 2-9-1-8-6v-4a6 6 0 0 0-1-4l-3-3c-3-3-2-9 3-10h4a6 6 0 0 0 4-3l2-4c2-4 8-4 10 0z"/></g>',
            IAminalStructs.VisualsCat.MISC
        );

        // ORDER MUST BE RESPECTED AT ALL COSTS:
        // Order: backId, armId, tailId, earsId, bodyId, faceId, mouthId, miscId

        // THREE-EYED AMINAL

        genes.mint(
            recipient,
            '<g id="BACK"><style>.st2{fill:#d3b36d}</style><path d="M0 0h1000v1000H0z" style="fill:#e9d6a2"/><ellipse cx="500" cy="976" rx="164" ry="12" style="fill:#d7af65"/><circle cx="147" cy="907" r="44" class="st2"/><circle cx="283" cy="874" r="11" class="st2"/><circle cx="464" cy="907" r="15" class="st2"/><circle cx="331" cy="906" r="5" class="st2"/><circle cx="574" cy="841" r="6" class="st2"/><circle cx="646" cy="824" r="17" class="st2"/><circle cx="764" cy="821" r="7" class="st2"/><circle cx="827" cy="782" r="16" class="st2"/><circle cx="207" cy="549" r="29" class="st2"/><circle cx="894" cy="600" r="40" class="st2"/><circle cx="935" cy="833" r="19" class="st2"/><circle cx="182" cy="664" r="19" class="st2"/><circle cx="810" cy="269" r="13" class="st2"/><circle cx="77" cy="261" r="6" class="st2"/><circle cx="245" cy="719" r="5" class="st2"/><circle cx="931" cy="916" r="36" class="st2"/></g>',
            IAminalStructs.VisualsCat.BACK
        );

        genes.mint(
            recipient,
            '<g id="ARMS"><path d="m445 742-4-31-2-16-2-14c-16-3-32-5-48-10l1 33 1 14 1 24 4 17c3 7 8 15 15 19 8 4 18 5 25 0 6-4 9-11 10-18l-1-18z" fill="#a1786e"/><path d="M568 741a2259 2259 0 0 1 8-66c18-3 36-6 53-11l-2 36v16l-2 25c-1 6-2 12-5 18-3 8-8 16-16 21s-19 5-27 0c-6-4-10-12-10-19l1-20z" fill="#a1786e"/><path d="m505 760-3-33a495 495 0 0 1-3-34c-15-2-29-5-43-11l1 37a844 844 0 0 0 6 60c2 8 6 16 13 21 6 4 15 5 22 0 5-4 8-12 8-19l-1-21zM557 732l-1-16-1-36c-13 7-27 11-42 15v16l-1 17-2 34v20c1 7 4 15 10 19 7 4 16 3 22-2s9-14 12-22l2-19 1-26z" fill="#a1786e"/></g>',
            IAminalStructs.VisualsCat.ARM
        );

        genes.mint(
            recipient,
            '<g id="TAIL"><path d="M462 674c-19 0-39 3-54 15l-7 8c-10 13-17 27-26 42-8 17-17 33-32 45-6 4-13 7-20 8-31 5-83-9-83-47 0-8 1-16 5-23 7-15 26-20 40-11 4 4 8 10 8 16 0 4-3 8-8 8-4 0-7-4-8-8 0-2-2-4-4-4-5-2-10 0-13 5-2 4-3 10-3 15v3c1 5 4 10 8 13 10 8 23 11 35 11 6 0 13 0 19-2l9-4c6-5 10-11 14-18 12-21 21-44 37-63l14-14c21-14 48-17 72-12 10 2 8 17-3 17z" fill="#99726a"/></g>',
            IAminalStructs.VisualsCat.TAIL
        );

        genes.mint(
            recipient,
            '<g id="EARS"><path d="M335 357c-11-23-34-144-30-163 4-17 30 24 65 63 12 13 38 37 48 55" fill="#99726a"/><path d="M346 361c-8-17-25-107-22-121 3-13 23 18 49 46 9 10 28 28 35 41" fill="#896862"/><path d="M663 366c10-24 33-145 29-163s-31 24-66 62c-12 13-38 38-47 56" fill="#99726a"/><path d="M652 370c7-18 24-108 21-122-3-13-23 18-49 47-9 9-28 28-35 41" fill="#896862"/></g>',
            IAminalStructs.VisualsCat.EARS
        );

        genes.mint(
            recipient,
            '<g id="BODY"><path d="M710 404c0 362-94 350-210 350s-210 23-210-350c0-116 94-219 210-219s210 103 210 219z" fill="#99726a"/><path d="M504 523c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 542c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM504 563c-2 3-6 3-8 0l-2-4-2-3c-2-4 0-8 4-8h8c4 0 6 4 5 8l-2 3-3 4zM504 504c-2 3-6 3-8 0l-2-4-2-4c-2-3 0-7 4-7h8c4 0 6 4 5 7l-2 4-3 4zM482 523c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 542c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM482 504c-2 3-7 3-8 0l-3-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4zM461 504c-2 3-6 3-8 0l-2-4-3-4c-1-3 1-7 5-7h8c4 0 6 4 4 7l-2 4-2 4zM527 523c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 542c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM527 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c3 0 6 4 4 7l-2 4-2 4zM547 504c-2 3-7 3-9 0l-2-4-2-4c-2-3 1-7 4-7h9c4 0 6 4 4 7l-2 4-2 4z" fill="#6c5655"/></g>',
            IAminalStructs.VisualsCat.BODY
        );

        genes.mint(
            recipient,
            '<g id="FACE"><style>.st10{fill:#265a5d}.st11{fill:#271b27}.st12{fill:#2b565b}.st13{fill:#fff</style><path d="M673 351c0 75-26 111-175 115-133 4-171-44-171-119s85-156 174-156 172 85 172 160z" style="fill:#70968c"/><path d="M659 345c0 51-24 59-163 62-123 2-159-14-159-66s76-90 159-90 163 42 163 94z" style="fill:#438786"/><circle cx="389" cy="343" r="43" class="st10"/><path d="M389 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" class="st11"/><ellipse cx="388" cy="329" class="st12" rx="27" ry="18"/><circle cx="369" cy="324" r="3" class="st13"/><circle cx="376" cy="319" r="2" class="st13"/><circle cx="500" cy="300" r="43" class="st10"/><path d="M500 265a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm-1 39c-15 0-27-8-27-18s12-18 27-18 27 8 27 18-12 18-27 18z" class="st11"/><ellipse cx="499" cy="286" class="st12" rx="27" ry="18"/><circle cx="480" cy="281" r="3" class="st13"/><circle cx="486" cy="276" r="2" class="st13"/><circle cx="604" cy="343" r="43" class="st10"/><path d="M604 308a36 36 0 1 0 0 71 36 36 0 0 0 0-71zm0 39c-15 0-27-8-27-18s12-18 27-18 26 8 26 18-12 18-26 18z" class="st11"/><ellipse cx="604" cy="329" class="st12" rx="27" ry="18"/><circle cx="584" cy="324" r="3" class="st13"/><circle cx="591" cy="319" r="2" class="st13"/></g>',
            IAminalStructs.VisualsCat.FACE
        );

        genes.mint(recipient, '<g id="MOUTH"></g>', IAminalStructs.VisualsCat.MOUTH);

        genes.mint(
            recipient,
            '<g id="MISC"><path d="m502 109 16 33 36 5-26 26 6 36-32-17-32 17 6-36-26-26 36-5z" fill="#fff"/></g>',
            IAminalStructs.VisualsCat.MISC
        );
    }
}
