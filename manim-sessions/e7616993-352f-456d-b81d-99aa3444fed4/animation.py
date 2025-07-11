from manim import *
import numpy as np
from sympy import MathTex, symbols, solve, expand, factor

class PolynomialApplications(Scene):
    def construct(self):

        self.intro()

        self.secret_sharing()

        self.polynomials()

        self.finite_fields()

        self.shamir_scheme()

        self.erasure_codes()

        self.polynomials_rescue()

        self.error_correction()

        self.berlekamp_welsh()

        self.conclusion()

    def intro(self):
        title = Text("Polynomials: Secret Sharing, Erasure Correction, and the Magic of Interpolation").to_edge(UP)
        self.play(Write(title))
        self.wait(2)

        curve = FunctionGraph(lambda x: np.sin(x) + np.cos(2*x), x_range=[-PI, PI, 0.1])
        self.play(Create(curve))
        self.wait(1)

        points = [
            Dot(curve.point_from_function(x)) for x in np.linspace(-PI, PI, 5)
        ]
        for point in points:
            self.play(Create(point))
            self.wait(0.5)

        self.play(FadeOut(curve, *points))
        self.wait(1)

        square1=Square(side_lengt, h=1).scale(0.5).shift(LEFT*2)
        square2=Square(side_lengt, h=1).scale(0.5).shift(RIGHT*2)
        circle=Circle(radiu, s=0.5).scale(0.5)
        self.play(Create(square1), Create(square2), Create(circle))
        self.wait(1)
        self.play(FadeOut(square1, square2, circle, title))
        self.wait(1)

    def secret_sharing(self):
        title = Text("Shamir's Secret Sharing").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        safe=Rectangle(widt, h=2, height=3).shift(LEFT*2)
        code = Text("SECRET").move_to(safe.get_center())
        self.play(Create(safe), Write(code))
        self.wait(1)

        pieces=[
            Square(side_lengt, h=0.5).shift(RIGHT*i) for i in range(5)
        ]
        for i, piece in enumerate(pieces):
            text = Text(f"Share {i+1}").move_to(piece.get_center())
            self.play(TransformFromCopy(code, piece), Write(text))
            self.add(text)  # add text so it is visible in FadeOut

        self.play(FadeOut(safe, code, title, *pieces, *[Text(f"Share {i+1}") for i in range(5)]))
        self.wait(1)

    def polynomials(self):
        title = Text("Polynomial Interpolation").to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        polynomial = MathTex("P(x) = a_dx^d + ... + a_0").move_to(UP*2)
        self.play(Write(polynomial))
        self.wait(1)

        axes=Axes(x_rang, e=[-5, 5, 1], y_range=[-5, 5, 1])
        line = axes.plot(lambda x: x + 1, color=BLUE)
        dot1 = Dot(axes.coords_to_point(-1, 0), color=RED)
        dot2 = Dot(axes.coords_to_point(1, 2), color=RED)
        self.play(Create(axes), Create(dot1), Create(dot2), Create(line))
        self.wait(1)
        self.play(FadeOut(axes, line, dot1, dot2))

        axes=Axes(x_rang, e=[-5, 5, 1], y_range=[-5, 5, 1])
        parabola = axes.plot(lambda x: x**2 - 2, color=BLUE)
        dot1 = Dot(axes.coords_to_point(-1, -1), color=RED)
        dot2 = Dot(axes.coords_to_point(0, -2), color=RED)
        dot3 = Dot(axes.coords_to_point(1, -1), color=RED)
        self.play(Create(axes), Create(dot1), Create(dot2), Create(dot3), Create(parabola))
        self.wait(1)

        self.play(FadeOut(axes, parabola, dot1, dot2, dot3, title, polynomial))
        self.wait(1)

    def finite_fields(self):
        title = Text("Finite Fields GF(p)").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        clock=Circle(radiu, s=2)
        numbers = [Text(str(i)).move_to(clock.point_at_angle(i * DEGREES * 30)) for i in range(12)]
        self.play(Create(clock), *[Write(num) for num in numbers])
        self.wait(1)

        arrow1 = Arrow(clock.point_at_angle(7 * DEGREES * 30), clock.point_at_angle(0), color=RED)
        text_mod = MathTex("7 + 5 \\equiv 0 \\mod{12}").move_to(DOWN*2)

        self.play(Create(arrow1), Write(text_mod))
        self.wait(2)

        self.play(FadeOut(clock, *numbers, arrow1, text_mod, title))
        self.wait(1)

    def shamir_scheme(self):
        title = Text("Shamir's Scheme in Action").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        axes=Axes(x_rang, e=[0, 5, 1], y_range=[0, 5, 1])
        polynomial = axes.plot(lambda x: 0.5*x**2 - x + 2, color=BLUE)
        secret_point = Dot(axes.coords_to_point(0, 2), color=GREEN) # Secret is the y-intercept

        self.play(Create(axes), Create(polynomial), Create(secret_point))
        self.wait(1)

        share1 = Dot(axes.coords_to_point(1, 1.5), color=RED)
        share2 = Dot(axes.coords_to_point(2, 2), color=RED)
        share3 = Dot(axes.coords_to_point(3, 3.5), color=RED)
        self.play(Create(share1), Create(share2), Create(share3))
        self.wait(1)
        
        self.play(FadeOut(axes, polynomial, secret_point, share1, share2, share3, title))
        self.wait(1)

    def erasure_codes(self):
        title = Text("Erasure Codes").to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        packets=[Square(side_lengt, h=0.5).shift(RIGHT*i) for i in range(5)]
        for packet in packets:
            self.play(Create(packet))
        self.wait(1)

        self.play(FadeOut(packets[1]), FadeOut(packets[3]))
        self.wait(1)

        self.play(FadeOut(*packets, title))
        self.wait(1)

    def polynomials_rescue(self):
        title = Text("Polynomials to the Rescue").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        axes=Axes(x_rang, e=[0, 5, 1], y_range=[0, 5, 1])
        points = [axes.coords_to_point(i+1, np.random.rand()*4+1) for i in range(3)]
        polynomial = axes.plot(lambda x: (x-1)*(x-2)*(x-3)*0.1 + 2, color=BLUE)

        self.play(Create(axes))
        dots = [Dot(point, color=RED) for point in points]
        for dot in dots:
            self.play(Create(dot))
        self.play(Create(polynomial))

        additional_points = [axes.coords_to_point(i+4, np.random.rand()*4+1) for i in range(2)]
        additional_dots = [Dot(point, color=YELLOW) for point in additional_points]
        for dot in additional_dots:
            self.play(Create(dot))

        self.wait(1)

        self.play(FadeOut(additional_dots[0]))
        self.play(FadeOut(dots[1]))

        self.wait(1)

        self.play(FadeOut(axes, polynomial, *dots, *additional_dots, title))
        self.wait(1)

    def error_correction(self):
        title = Text("Error Correction").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        packets=[Square(side_lengt, h=0.5).shift(RIGHT*i) for i in range(5)]
        for packet in packets:
            self.play(Create(packet))
        self.wait(1)

        self.play(packets[2].set_color, RED)
        self.wait(1)

        self.play(FadeOut(*packets, title))
        self.wait(1)

    def berlekamp_welsh(self):
        title = Text("Berlekamp-Welsh Algorithm").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        q_polynomial = MathTex("Q(x)").shift(UP)
        e_polynomial = MathTex("E(x)").shift(DOWN)

        self.play(Write(q_polynomial), Write(e_polynomial))
        self.wait(1)

        division = MathTex("\\frac{Q(x)}{E(x)}").move_to(ORIGIN)
        self.play(Write(division))
        self.wait(1)

        original_message = Text("Original Message").move_to(DOWN*2)
        self.play(Write(original_message))
        self.wait(1)

        self.play(FadeOut(q_polynomial, e_polynomial, division, original_message, title))
        self.wait(1)

    def conclusion(self):
        title = Text("Conclusion").to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        square=Square(side_lengt, h=1).scale(0.5).shift(LEFT)
        circle=Circle(radiu, s=0.5).scale(0.5).shift(RIGHT)
        self.play(Create(square), Create(circle))
        self.wait(1)

        final_curve = FunctionGraph(lambda x: np.sin(x), x_range=[-PI, PI, 0.1])
        points = [
            Dot(final_curve.point_from_function(x)) for x in np.linspace(-PI, PI, 5)
        ]
        self.play(Create(final_curve))
        for point in points:
            self.play(Create(point))

        self.wait(2)
        self.play(FadeOut(square, circle, final_curve, *points, title))
        self.wait(1)

def main():
    config.media_dir="./media"
    scen, e=PolynomialApplications()
    scene.render()

if __name__ == "__main__":
    main()