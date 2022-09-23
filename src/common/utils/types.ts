interface LogData {
	game: string;
	encounters: Encounter[];
	static: StaticPoke[];
}

interface Encounter {
	setNum: number;
	route: string;
	tile: string;
	mons: Mon[];
}

interface Mon {
	name: string;
	level: string;
	rod?: string;
	rate: number;
}

interface StaticPoke {
	original: string;
	new: string;
}

export type { LogData, Encounter, Mon, StaticPoke };
