import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect('https://cms.pioneera.net/wp-admin');
}
