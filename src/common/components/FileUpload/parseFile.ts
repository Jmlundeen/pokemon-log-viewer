import { frlg } from '@utils/encounterPercents';
import { expressions } from '@utils/regExpressions';
import { Encounter, LogData, Mon, StaticPoke } from '@utils/types';

function rateSwitch(enc: Encounter) {
	switch (enc.tile) {
		case 'Grass/Cave':
			return frlg.Grass;
		case 'Surfing':
			return frlg.Surf;
		case 'Rock Smash':
			return frlg.RockSmash;
		case 'Fishing':
			return frlg.Fishing;
		default:
			return [];
	}
}

function strToNum(arr: string[]) {
	let temp: number[] = [];
	arr.forEach((str) => temp.push(Number(str)));
	let min = Math.min(...temp);
	let max = Math.max(...temp);
	let res = min == max ? `${max}` : `${min}-${max}`;
	return res;
}

function reduceEncounters(enc: Encounter) {
	let initial: Mon[] = [];
	enc.mons = enc.mons.reduce((prev, curr) => {
		const duplicate = prev.find(
			(e: Mon) => e.name == curr.name && e.rod == curr.rod
		);
		if (duplicate) {
			duplicate.rate += curr.rate;
			let tempPrevLevel = duplicate.level.match('-')
				? duplicate.level.split('-')
				: [duplicate.level];
			let tempCurrLevel = curr.level.match('-')
				? curr.level.split('-')
				: [curr.level];
			duplicate.level = strToNum(tempCurrLevel.concat(tempPrevLevel));
		} else {
			prev.push(curr);
		}
		return prev;
	}, initial);
}

function parseFile(log: LogData, logText: string) {
	// Separate each set of encounters
	let wildEncounters = logText
		.match(expressions.encounters)?.[1]
		.split(/\r\n\r\n/);
	// Separate static encounters
	let staticEncounters = logText
		.match(expressions.staticEnc)?.[1]
		.split(/\r\n/);
	// Get game name
	let gameRegex = logText.match(expressions.game);
	if (gameRegex) {
		log.game = gameRegex[1]
			? gameRegex[1]
			: gameRegex[3]
			? gameRegex[3]
			: gameRegex[2];
	}

	if (['Fire Red'].includes(log.game))
		if (staticEncounters) {
			staticEncounters.forEach((x) => {
				let obj: StaticPoke = {
					original: '',
					new: '',
				};
				let temp = x.split(' => ');
				obj.original = temp[0];
				obj.new = temp[1];
				log.static.push(obj);
			});
		}
	if (wildEncounters) {
		wildEncounters.forEach((x) => {
			let enc: Encounter = {
				setNum: 0,
				route: '',
				tile: '',
				mons: [],
			};
			let temp = x.split(/\r\n/);
			temp.forEach((line, i) => {
				if (i == 0) {
					let routeSplit = line.match(expressions.setLine);
					if (!routeSplit) {
						console.log('no route found');
						return;
					}
					enc.setNum = Number(routeSplit[1]);
					enc.route = routeSplit[2];
					enc.tile = routeSplit[3];
				} else {
					let mon = line.match(expressions.getMon);
					if (!mon) {
						console.log('no mon found');
						return;
					}
					let level = mon[3] ? mon[3] : mon[2];
					let name = mon[1];
					let rod =
						enc.tile == 'Fishing'
							? i < 3
								? 'Old'
								: i < 6
								? 'Good'
								: 'Super'
							: undefined;
					let rate = rateSwitch(enc);
					enc.mons.push({
						level: level,
						name: name,
						rod: rod,
						rate: rate[i - 1],
					});
				}
			});
			reduceEncounters(enc);
			log.encounters.push(enc);
		});
	}
	if (log.encounters.length != 0)
		console.log(log.encounters.find((e) => e.setNum == 3));
}

export { parseFile };
