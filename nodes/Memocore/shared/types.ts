export type TColumnType = 'text' | 'number' | 'datetime' | 'checkbox' | 'select' | 'multiselect';

export type TColumn = {
	id: string;
	name: string;
	description: string;
	type: TColumnType;
	required: boolean;
	unique: boolean;
	options: string[];
};

export type TProject = {
	id: string;
	name: string;
	description: string;
	type: 'memos' | 'table';
};

export type TProjectWithColumns = TProject & {
	columns: TColumn[];
};

export type TTag = {
	id: string;
	name: string;
	context?: string;
};
