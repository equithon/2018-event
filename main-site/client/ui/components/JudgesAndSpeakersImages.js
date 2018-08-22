import React, { Component } from 'react';

import Text from '/client/ui/components/Text.js';


/*
 * Collection of images and text of judges and speakers of the event
 */
export default class JudgesAndSpeakers extends Component {
    render() {
        return(
            <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <JudgesImageText
                        src="/images/judges/EvaWong.png"
                        name="Eva Wong"
                        occupation="Co-founder and Chief Operating Officer @ Borrowell"
                        topic="Keynote"
                    />
                    <JudgesImageText
                        src="/images/judges/AlbertLam.png"
                        name="Albert Lam"
                        occupation="Co-founder of Canadian Chapter @ Gaingels"
                        topic="LGBTQ+ Rights"
                    />
                    <JudgesImageText
                        src="/images/judges/AngeliqueMohring.png"
                        name="Angelique Mohring"
                        occupation="Founder @ GainX"
                        topic="Women Empowerment"
                    />
                    <JudgesImageText
                        src="/images/judges/CarmenSutherland.png"
                        name="Carmen Sutherland"
                        occupation="Community Relations @ Bridges to Belonging"
                        topic="Physical Disabilities"
                    />
                    <JudgesImageText
                        src="/images/judges/DavidDunnem.jpg"
                        name="David Dunnem"
                        occupation="IT Manager @ KidsAbility"
                        topic="Physical Disabilities"
                    />
                    <JudgesImageText
                        src="/images/judges/GordTanner.jpg"
                        name="Gord Tanner"
                        occupation="Co-founder @ MakingSpace.tech"
                        topic="LGBTQ+ Rights"
                    />
                    <JudgesImageText
                        src="/images/judges/JuliaHanigsberg.png"
                        name="Julia Hanigsberg"
                        occupation="President & CEO @ Holland Bloorview Kids Rehabilitation Hospital"
                        topic="Physical Disabilities"
                    />
                    <JudgesImageText
                        src="/images/judges/MaryamJahed.jpg"
                        name="Maryam Jahed"
                        occupation="Founder & COO @ AIRO Health"
                        topic="Mental Health"
                    />
                    <JudgesImageText
                        src="/images/judges/RenishakiKamal.png"
                        name="Renishaki Kamal"
                        occupation="Founder and Chief Toy Maker @ Fidget Toys"
                        topic="Mental Health"
                    />
                    <JudgesImageText
                        src="/images/judges/SageFranch.png"
                        name="Sage Franch"
                        occupation="Co-founder & CTO @ Crescendo Inclusive Workplaces"
                        topic="Women Empowerment"
                    />
                    <JudgesImageText
                        src="/images/judges/SaraBingham.jpg"
                        name="Sara Bingham"
                        occupation="Executive Director @ Women's March"
                        topic="Women Empowerment"
                    />
                    <JudgesImageText
                        src="/images/judges/ShyraBarberstock.png"
                        name="Shyra Barberstock"
                        occupation="President & CEO @ Okwaho Equal Score"
                        topic="Access to Education"
                    />
                    <JudgesImageText
                        src="/images/judges/TaylorBond.png"
                        name="Taylor Bond"
                        occupation="VP @ VentureOut"
                        topic="LGBTQ+ Rights"
                    />
                    <JudgesImageText
                        src="/images/judges/TinaChan.png"
                        name="Tina Chan"
                        occupation="Founder @ PASS"
                        topic="Mental Health"
                    />
                    <JudgesImageText
                        src="/images/judges/TusharSingh.png"
                        name="Tushar Singh"
                        occupation="CEO & Founder @ MinuteSchool"
                        topic="Access to Education"
                    />
                    <JudgesImageText
                        src="/images/judges/WillZhou.png"
                        name="William Zhou"
                        occupation="CEO @ Chalk"
                        topic="Access to Education"
                    />
                </div>
            </div>
        );
    }
}


/*
 * Image and text for judges and speakers
 */
const JudgesImageText = ({ src, name, occupation, topic }) => (
    <div style={{ display: 'flex', justifySelf: 'center', width: '280px', height: '150px' }}>
        <div style={{ width: '100px', paddingLeft: '10px' }}>
            <img style={{ borderRadius: '10px' }} src={src} alt={name} />
        </div>
        <div style={{ paddingLeft: '10px' }}>
            <Text color="primary" type="body2" text={name} />
            <Text color="textSecondary" type="body2" text={occupation} />
            <Text color="textSecondary" type="body1" text={topic} />
        </div>
    </div>
);

